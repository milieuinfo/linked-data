import queryCacheMixin from '../js/queryCacheMixin';
export default {
    mixins: [queryCacheMixin],
    props: {
        endpoint: String,
        graph: String,
    },
    data() {
        return {
            loading: 0,
            requests: {},
            offset: null,
            loadedOffset: null,
            rows: [],
            rowCount: null,
            pageSize: 10,
            uniqueField: null,
            sortField: null,
            sortDirection: 'ASC',
            queryTemplate: '',
            countQueryTemplate: '',
            search: '',
            fields: []
        }
    },
    computed: {
        from() {
            return this.graph ? `FROM <${this.graph}>` : '';
        },
        filters() {
            if (!this.search.trim().length || !this.searchFields.trim().length) {
                return '';
            }

            let searchFields = this.searchFields.split(/[,\s]+/);
            let filters = this.search.split(/[\s]+/).filter(keyword => !keyword.match(/^\s*$/)).map((keyword) => {
                return '(' + searchFields.map((field) => {
                    keyword = keyword.replace(/["';<>]/, '');
                    return keyword.length
                        ? `regex(str(?${field}), "${keyword.replace(/["';<>]/, '')}", "i")`
                        : '';
                }).join(' || ') + ')'
            });
            return `FILTER(${filters.join(' ) && ( ')})`;
        },
        page() {
            return 1 + Math.ceil(this.offset / this.pageSize);
        },
        pageCount() {
            return Math.ceil(this.rowCount / this.pageSize);
        },
        prevOffset() {
            if (!this.rowCount) {
                return null;
            }

            return Math.max(0, this.offset - this.pageSize);
        },
        nextOffset() {
            if (!this.rowCount) {
                return null;
            }

            let nextOffset = this.offset + this.pageSize;
            if (nextOffset > this.rowCount - 1) {
                nextOffset = this.offset;
            }

            return nextOffset;
        }
    },
    watch: {
        rows(value) {
            if (value) {
                this.countRows();
            }
        },
        offset: _.debounce(function(value) {
            if (value !== null) {
                this.fetchRows();
            }
        }, 500),
        sortField() {
            this.offset = 0;
            this.fetchRows();
        },
        sortDirection() {
            this.offset = 0;
            this.fetchRows();
        },
        pageSize() {
            this.offset = 0;
            this.fetchRows();
        },
        search: _.debounce(function(value) {
            this.offset = this.rowCount = 0;
            this.fetchRows();
        }, 500),
    },
    methods: {
        renderQueryTemplate(query) {
            let done;
            do {
                done = true;
                let matches = query.match(/(%([^%]+)%)/);
                if (matches) {
                    let placeholder = matches[1];
                    let prop = matches[2];

                    // strict check
                    if ((typeof this[prop] === 'undefined') || this[prop] === null) {
                        query = null;
                        console.log('undefined query template placeholder', prop);
                        break;
                    } else {
                        done = false;
                        query = query.replace(placeholder, this[prop]);
                    }
                }
            } while (!done);
            return query;
        },

        fetchRows() {
            let query = this.renderQueryTemplate(this.queryTemplate || '');
            if (!query) {// query template or placeholder variables not available yet
                return setTimeout(this.fetchRows, 500);
            }

            this.loading++;
            this.runQuery(query, (response) => {
                this.fields = response.vars.map((field) => {
                    return {
                        name: field,
                        label: field
                    }
                });
                this.rows = response.rows.filter(this.removeDuplicates);
                this.loadedOffset = this.offset;
                setTimeout(() => this.loading--, 250);
            })
        },

        /**
         * Removes duplicates via `uniqueField`, if set
         */
        removeDuplicates(row, index, rows) {
            if (this.uniqueField && index && rows[index - 1][this.uniqueField]) {
                let prevValue = rows[index - 1][this.uniqueField].value;
                let thisValue = rows[index][this.uniqueField].value;
                if (prevValue === thisValue) {
                    return false;
                }
            }

            return true;
        },

        countRows() {
            let query = this.renderQueryTemplate(this.countQueryTemplate || '');
            if (!query) {// query template or placeholder variables not available yet
                return setTimeout(this.countRows, 500);
            }

            this.runQuery(query, (response) => {
                this.rowCount = response.rows.length ? parseInt(response.rows[0].rowCount.value) : null;
            })
        },

        runQuery(query, callback) {
            if (this.getCachedQueryResults(query)) {
                return callback(this.getCachedQueryResults(query));
            }

            const requestId = query;
            this.$http.post(
                this.endpoint,
                {
                    query: query
                },
                {
                    credentials: true,
                    emulateJSON: true,
                    headers: {
                        Accept: 'application/sparql-results+json, application/json, */*'
                    },
                    before(request) {
                        if (this.requests[requestId]) {
                            this.requests[requestId].abort();
                        }

                        this.requests[requestId] = request;
                    }
                }
            )
            .then(response => {
                delete this.requests[requestId];
                this.setCachedQueryResults(query, {
                    vars: response.body.head.vars,
                    rows: response.body.results.bindings
                });
                callback(this.getCachedQueryResults(query));
            }, error => {
                //console.log('Error, possibly just aborted', error);
                callback({ vars: [], rows: [] });
            })
        },

        getFieldLabel(name, row) {
            if (row[`_${name}Label`]) {
                return row[`_${name}Label`].value;
            } else {
                return row[name].value.replace(/^.*[\/#]([^\/#]+)$/, '$1');
            }
        }
    }
}
