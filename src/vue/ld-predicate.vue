<template>
    <flex-item class="ld-predicate-container" :dsk="desktopWidth" mob="100" :no-gutter="isInBode" :class="{ 'is-in-bnode': isInBode, inbound: inbound, loading: loading }">
        <div class="loader" :class="{ loading: loading }"></div>
        <ld-card class="ld-predicate">

            <flex-container no-gutter>
                <flex-item :dsk="inbound ? 100 : 33" mob="100" no-gutter>
                    <span class="predicate-info" :class="{ inbound: inbound }">
                        <span v-if="rowCount" class="row-count">{{ rowCount.toLocaleString() }}x </span>
                        <span class="label-container"></span><span v-if="inbound" class="subject-label">: {{ resourceTitle }}</span>
                    </span>
                </flex-item>
                <flex-item class="objects" :dsk="inbound ? 100 : 66" mob="100" no-gutter>
                    <slot></slot>
                    <ld-taxonomy v-if="endpoint && isTaxonomy" :endpoint="endpoint" :graph="graph" :subject="subject" :predicate="predicate"></ld-taxonomy>
                    <span v-else-if="endpoint && !rows.length"><ld-object>0 treffers</ld-object></span>
                    <ld-object v-else v-for="(row, index) in rows" :key="offset + index">
                        <a v-if="row.uri.type === 'uri'" :href="row.uri.value">{{ row.titel ? row.titel.value : row.uri.value }}</a>
                        <template v-else>{{ row.uri.value }}</template>
                    </ld-object>
                </flex-item>
            </flex-container>

            <flex-container v-if="endpoint && !isTaxonomy" class="controls" no-gutter>
                <flex-item class="sorter" :dsk="25" no-gutter>
                    <select v-model="sortString">
                        <template v-for="sortOption in sortOptions">
                            <option :value="sortOption.value">{{ sortOption.label }}</option>
                        </template>
                    </select>
                </flex-item>
                <flex-item class="filter" :dsk="25" no-gutter>
                    <input type="text" v-model="search" placeholder="Filteren ..." autocomplete="off" />
                </flex-item>
                <flex-item class="pagination" :dsk="50" no-gutter>
                    <span class="info" v-if="rowCount">
                        Pagina {{ page }}/{{ pageCount }}
                    </span>
                    <span class="buttons">
                        <button v-if="prevOffset !== null" @click="offset = prevOffset" :title="prevOffset" :class="{ disabled: offset === prevOffset}">
                            <v-icon>chevron_left</v-icon>
                        </button>
                        <button v-if="nextOffset !== null" @click="offset = nextOffset" :title="nextOffset" :class="{ disabled: offset === nextOffset}">
                            <v-icon>chevron_right</v-icon>
                        </button>
                    </span>
                </flex-item>
            </flex-container>
        </ld-card>
    </flex-item>
</template>

<script>
    import sparqlMixin from '../js/sparql-mixin';
    export default {
        mixins: [sparqlMixin],
        props: {
            about: String,
            inbound: Boolean,
            wide: Boolean
        },
        data() {
            return {
                subject: null,
                isInBode: false,
                labelMoved: false,
                offset: 0,
                pageSize: 8,
                searchFields: 'uri,titel',
                sortFields: 'titel',
                sortField: 'titel',
                sortString: 'ASC(?titel)',
                uniqueField: 'uri',
                taxonomyProps: [
                    'http://www.w3.org/2004/02/skos/core#hasTopConcept',
                    'http://www.w3.org/2004/02/skos/core#topConceptOf',
                    'http://www.w3.org/2004/02/skos/core#inScheme',
                    'http://www.w3.org/2004/02/skos/core#broader',
                    'http://www.w3.org/2004/02/skos/core#narrower'
                ]
            }
        },
        computed: {
            resourceTitle() {
                if (!document.querySelector || !document.querySelector('h1')) {
                    return '';
                }

                return document.querySelector('h1').innerText;
            },
            desktopWidth() {
                return (this.isInBode || this.wide) ? 100 : 50;
            },
            predicate() {
                return this.about;
            },
            sortOptions() {
                let options = [];
                this.sortFields.split(/[,\s]+/).forEach((sortField) => {
                    options.push({
                        value: `ASC(?${sortField})`,
                        label: `↑ ${sortField.charAt(0).toUpperCase() + sortField.slice(1)}`
                    });
                    options.push({
                        value: `DESC(?${sortField})`,
                        label: `↓ ${sortField.charAt(0).toUpperCase() + sortField.slice(1)}`
                    });
                });

                return options;
            },
            isTaxonomy() {
                return this.predicate && !this.inbound && (this.taxonomyProps.indexOf(this.predicate) !== -1);
            }
        },
        mounted() {
            this.extractSubject();
            this.moveLabel();
            this.checkBnodeContext();
        },
        watch: {
            labelMoved() {
                if (this.endpoint) {
                    this.clearObjects();
                    if (!this.isTaxonomy) {
                        this.fetchQueryTemplate();
                        this.fetchCountQueryTemplate();
                        this.fetchRows();
                    }
                }
            },

            sortString(value) {
                let matches = value ? value.match(/(ASC|DESC)\(\?([^)]+)/) : null;
                if (matches) {
                    this.sortField = matches[2];
                    this.sortDirection = matches[1];
                }
            }
        },
        methods: {
            extractSubject() {
                if (!this.$el || !this.$el.closest || !this.$el.closest('.ld-subject')) {
                    return setTimeout(this.extractSubject, 250);
                }

                this.subject = this.$el.closest('.ld-subject[about]').getAttribute('about');
            },
            moveLabel() {
                if (!this.$el || !this.$el.querySelector) {
                    return setTimeout(this.moveLabel, 100);
                }

                let $labelContainer = this.$el.querySelector('.label-container');
                if (!$labelContainer) {
                    return setTimeout(this.moveLabel, 100);
                }

                let $label = this.$el.querySelector('.objects > .label');
                if ($label) {
                    $labelContainer.appendChild($label);
                }

                this.labelMoved = true;
            },

            checkBnodeContext() {
                if (!this.$el || !this.$el.querySelector) {
                    return setTimeout(this.checkBnodeContext, 100);
                }

                if (this.$el.closest('.ld-object.bnode')) {
                    this.isInBode = true;
                }
            },

            fetchQueryTemplate() {
                const queryHref = this.inbound ? '/queries/objects-inbound.rq' : '/queries/objects-outbound.rq';
                this.$http.get(queryHref).then((response) => {
                    this.queryTemplate = response.body;
                });
            },

            fetchCountQueryTemplate() {
                const queryHref = this.inbound ? '/queries/objects-inbound-count.rq' : '/queries/objects-outbound-count.rq';
                this.$http.get(queryHref).then((response) => {
                    this.countQueryTemplate = response.body;
                });
            },

            clearObjects() {
                if (!this.$el || !this.$el.querySelector) {
                    return setTimeout(this.clearObjects, 100);
                }

                this.$el.querySelectorAll('.objects > .ld-object').forEach(($object) => {
                    $object.parentNode.removeChild($object);
                })
            }
        }
    }
</script>

<style lang="scss">
@import "../css/_variables";

.ld-predicate-container {

    .ld-predicate {
        background-color: #fff;
        border-top: 2px solid $green;

        .predicate-info {
            display: block;
            background-color: $green;
            color: #fff;
            text-align: right;
            line-height: 24px;
            padding: 4px 12px 6px 12px;
            white-space: nowrap;
            overflow: hidden;
            text-decoration: none;
            text-overflow: ellipsis;

            &.inbound {
                text-align: left;
            }

            @media (max-width: $flex-mobile-max-width) {
                text-align: left;
            }

            .label {
                text-transform: capitalize;
                color: $white !important;
                &:hover {
                    text-decoration: none !important;
                }

            }

            .subject-label {
                opacity: 0.75;
            }
        }

        .objects {
            padding-bottom: 0 !important;
            overflow: auto;
            max-height: 400px;
            transition: opacity 0.5s;
            opacity: 1;
        }

        .controls {
            border-top: 1px solid $grey;
            padding: 8px 0;

            .flex-item {
                padding: 0 4px !important;

                &:first-child {
                    padding-left: 8px !important;
                }

                &:last-child {
                    padding-right: 8px !important;
                }
            }

            .sorter select {
                display: block;
                line-height: 24px;
                padding: 0 4px;
                font-size: 13px;
                height: 28px;
                width: 100%;
                -webkit-appearance: none;
                border: 1px solid #ccc;
                border-radius: 0;
            }

            .filter input {
                display: block;
                line-height: 24px;
                padding: 0 4px;
                font-size: 13px;
                width: 100%;
                height: 28px;
            }

            .pagination {
                text-align: right;
                display: block;

                .info {
                    display: inline-block;
                    line-height: 30px;
                    padding: 0 4px 0;
                    vertical-align: top;
                }

                .buttons {
                    display: inline-block;

                    button {
                        cursor: pointer;
                        background-color: $green;
                        border: none;
                        height: 28px;
                        width: 28px;

                        &.disabled {
                            cursor: default;
                            background-color: $grey-light;
                            &:hover, &:focus, &::-moz-focus-inner {
                                cursor: default;
                                background-color: $grey-light;
                            }
                        }

                        &:hover, &:focus, &::-moz-focus-inner {
                          background-color: #42796d;
                          outline: 0;
                          border: 0;
                        }

                        .v-icon {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }

    &.is-in-bnode {
        margin-top: 4px;

        &:first-child {
            margin-top: 0;
        }
    }

    &.inbound {
        .label-container {
            -order: 1;
        }
    }

    &.loading {
        .objects {
            opacity: 0.1;
        }
    }
}
</style>
