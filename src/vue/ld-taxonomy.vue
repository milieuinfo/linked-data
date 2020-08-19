<template>
    <ul class="ld-taxonomy">
        <li v-for="(row, index) in rows" :key="index" :class="{ expanded: expanded[row.uri.value], 'is-subject': subject === row.uri.value }">
            <v-icon class="empty-arrow" title="last entry">last_page</v-icon>
            <v-icon class="toggle-arrow" @click="toggle(row.uri.value)">chevron_right</v-icon>
            <a v-if="row.uri.type === 'uri'" :href="row.uri.value" @click="onClick">{{ row.label ? row.label.value : row.uri.value }}</a>
            <template v-else>{{ row.uri.value }}</template>
            <ld-taxonomy v-if="expanded[row.uri.value]" :endpoint="endpoint" :graph="graph" :subject="subject" :predicate="predicate" :parent="row.uri.value" :chain="conceptChain"></ld-taxonomy>
        </li>
    </ul>
</template>

<script>
    import sparqlMixin from '../js/sparql-mixin';
    import localHrefMixin from '../js/localHrefMixin';
    export default {
        mixins: [sparqlMixin, localHrefMixin],
        props: ['subject', 'predicate', 'parent', 'chain'],
        data() {
            return {
                uniqueField: 'uri',
                expanded: {},
                conceptChain: this.chain || null, // the chain of URIs from given subject up to its scheme
                parentResource: this.parent || null
            }
        },
        mounted() {
            this.fetchQueryTemplate();
            this.$parentCollapsible = this.$el.closest('.ld-collapsible');
        },
        watch: {
            queryTemplate() {
                if (!this.conceptChain) {
                    this.fetchChain();
                } else {
                    this.fetchConcepts();
                }
            },
            loading() {
                if (this.$parentCollapsible) {
                    this.$parentCollapsible.component.$emit('contentChanged');
                }
            }
        },
        methods: {
            fetchQueryTemplate() {
                if (!this.subject) {
                    return setTimeout(this.fetchQueryTemplate, 500);
                }

                // query for next-level concepts (default)
                let queryHref = '/queries/taxonomy-down.rq';

                // fetch the upper chain if not done yet, unless we only need the children
                if (!this.conceptChain) {
                    if (this.predicate.match(/#(narrower|hasTopConcept)/)) {
                        this.conceptChain = [this.subject];
                        this.parentResource = this.subject;
                    } else {
                        queryHref = '/queries/taxonomy-up.rq';
                    }
                }

                this.$http.get(queryHref).then((response) => {
                    this.queryTemplate = response.body;
                });
            },
            countRows() {},
            fetchRows() {},
            fetchChain() {
                let query = this.renderQueryTemplate(this.queryTemplate || '');
                if (!query) {// query template or placeholder variables not available yet
                    return setTimeout(this.fetchChain, 500);
                }

                this.loading++;
                this.runQuery(query, (response) => {
                    let rows = response.rows.filter(this.removeDuplicates);

                    // set chain
                    this.conceptChain = rows.filter((row) => {
                        return (row.type.value === 'http://www.w3.org/2004/02/skos/core#Concept');
                    }).map((row) => {
                        return row.uri.value;
                    });

                    // get top-level row(s)
                    let schemeRows = rows.filter((row) => {
                        return (row.type.value === 'http://www.w3.org/2004/02/skos/core#ConceptScheme');
                    });

                    // set expansion info
                    if (!this.predicate.match(/#(topConceptOf|inScheme)$/)) {
                        schemeRows.forEach((row) => {
                            this.$set(this.expanded, row.uri.value, true);
                        });
                    }

                    // set rows
                    this.rows = schemeRows;

                    setTimeout(() => this.loading--, 250);
                })
            },
            fetchConcepts() {
                let query = this.renderQueryTemplate(this.queryTemplate || '');
                if (!query) {// query template or placeholder variables not available yet
                    return setTimeout(this.fetchConcepts, 500);
                }

                this.loading++;
                this.runQuery(query, (response) => {
                    let rows = response.rows.filter(this.removeDuplicates);

                    // set expansion info (concept is expanded if in chain and not subject)
                    rows.forEach((row) => {
                        if ((this.conceptChain.indexOf(row.uri.value) !== -1) && row.uri.value !== this.subject) {
                            this.$set(this.expanded, row.uri.value, true);
                        }
                    });

                    // flag parent if empty
                    if (!rows.length) {
                        this.$el.closest('li').classList.add('empty');
                    }

                    // set rows
                    this.rows = rows;

                    setTimeout(() => this.loading--, 250);
                })
            },
            toggle(uri) {
                this.$set(this.expanded, uri, !this.expanded[uri]);
                if (this.$parentCollapsible) {
                    this.$nextTick(() => {
                        this.$parentCollapsible.component.$emit('contentChanged');
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../css/_variables";

.ld-taxonomy {
    list-style-type: none;
    padding: 0 !important;
    margin: 0 !important;

    li {
        line-height: 24px !important;
        margin: 0 !important;
        padding: 4px 0 6px 4px;
        overflow: hidden;
        text-decoration: none;
        text-overflow: ellipsis;

        .v-icon {
            vertical-align: text-top;
            font-size: 22px;
            transition: transform 0.5s, opacity 1s;
        }

        .empty-arrow {
            width: 0;
            overflow: hidden;
            opacity: 0;
            font-size: 20px;
        }

        &.empty {
            .toggle-arrow {
                display: none;
            }
            .empty-arrow {
                width: 25px;
                padding: 1px 1px 1px 4px;
                display: inline-flex;
                opacity: 1;
            }
        }

        &.is-subject {
            > a {
                color: $text-color !important;
            }
        }

        ul {
            padding-left: 16px !important;

            li {
                line-height: 20px !important;
                padding: 2px 0 3px 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        &.expanded {
            > .toggle-arrow {
                transform: rotate(90deg);
            }
        }
    }
}

</style>
