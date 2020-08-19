<template>
    <div class="ld-sparql-form">
        <h4 class="pane-toggle"><slot></slot></h4>
        <form class="pane" method="GET" @submit.prevent="onSubmit" @reset="onSparqlReset">
            <div class="fields">
                <textarea v-model="inputValue" placeholder="Voer een SPARQL zoekopdracht in ..."></textarea>
            </div>
            <div class="buttons">
                <flex-container>
                    <flex-item dsk="66" mob="100">
                            <button type="submit">Zoekopdracht uitvoeren</button>
                            <button type="reset">Herladen</button>
                            <span class="status pulsing" v-if="loading">Even geduld ...</span>
                    </flex-item>
                    <flex-item dsk="33" mob="100">
                        <select class="samples" size="1" v-model="selectedSample">
                            <option value="">Voorbeelden ...</option>
                            <option v-for="option in sampleOptions" :value="option.value" :title="option.value">{{ option.label }}</option>
                        </select>
                    </flex-item>
                </flex-container>
            </div>
        </form>
    </div>
</template>

<script>
    import AccordionPaneMixin from '../js/accordion-pane-mixin';
    import ApiFormMixin from '../js/api-form-mixin';
    import 'yasgui-yasqe/dist/yasqe.min.css'
    import YASQE from 'yasgui-yasqe/dist/yasqe.bundled.min'

    export default {
        mixins: [AccordionPaneMixin, ApiFormMixin],
        data() {
            return {
                name: 'sparqlForm',
                yasqe: null
            }
        },

        watch: {
            inputValue(value) {
                if (!this.yasqe) {
                    return;
                }

                if (value) {
                    this.yasqe.setValue(value);
                } else {
                    this.resetYasqe();
                }
            }
        },

        mounted() {
            this.initFromHash();
            this.initYasqe();
        },

        methods: {
            initFromHash() {
                const matches = location.hash ? location.hash.match(/^.*&query=([^&]+).*/) : null;
                if (matches) {
                    this.inputValue = decodeURIComponent(matches[1].replace(/\+/g, ' '));
                }
            },
            initYasqe() {
                if (this.yasqe) {
                    return; // already initialized
                }

                this.yasqe = YASQE.fromTextArea(
                    this.$el.querySelector('textarea'),
                    {
                        sparql: {
                            showQueryButton: false
                        }
                    }
                );
                this.resetYasqe();
            },

            resetYasqe() {
                const textarea = this.$el.querySelector('textarea');
                this.yasqe.setValue('# ' + textarea.getAttribute('placeholder'));
            },

            parseSamples(response) {
                this.sampleOptions = response.body
                    .split(/(^|[\r\n]+)##/)
                    .filter((chunk) => {
                        return !chunk.match(/^[\r\n\s]*$/)
                            && !chunk.match(/^#/)
                        ;
                    })
                    .map((chunk) => {
                        const parts = chunk.trim().match(/^([^\r\n]+)[\r\n]+([\s\S]+)$/) || ['', '', ''];// `LABEL\r\nQUERY`
                        return {
                            value: '# ' + parts[1] + "\n" + parts[2],
                            label: parts[1]
                        };
                    })
                ;
            },

            onSparqlReset() {
                this.onReset();
                this.resetYasqe();
            },

            onSubmit() {
                let query = this.yasqe ? this.yasqe.getValue() : this.inputValue;
                if (query) {
                    this.loading = true;
                    location.hash = this.name + '&query=' + encodeURIComponent(query);// allow re-init when user hits BACK button
                    location.href = this.endpoint + '?query=' + encodeURIComponent(query);
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../css/_variables";

    .ld-sparql-form {

        .buttons {
            padding-top: 8px !important;
            padding-bottom: 4px !important;
        }

        .CodeMirror-fullscreen {
            bottom: 110px;
        }

        .CodeMirror-code * {
            font-size: 14px;
            line-height: 1.5em;
        }
    }
</style>
