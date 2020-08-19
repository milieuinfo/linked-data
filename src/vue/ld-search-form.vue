<template>
    <div class="ld-search-form">
        <h4 class="pane-toggle"><slot></slot></h4>
        <form class="pane" method="GET" @submit.prevent="onSubmit" @reset="onReset">
            <div class="fields">
                <flex-container>
                    <flex-item dsk="66" tab="50" mob="100">
                        <input v-model="inputValue" type="text" placeholder="Voer een sleutelwoord in ..."/>
                    </flex-item>
                    <flex-item dsk="33" tab="50" mob="100">
                        <select class="samples" size="1" v-model="selectedSample">
                            <option value="">Voorbeelden ...</option>
                            <option v-for="option in sampleOptions" :value="option.value" :title="option.value">{{ option.label }}</option>
                        </select>
                    </flex-item>
                </flex-container>
            </div>
            <div class="buttons">
                <button type="submit">Zoekopdracht uitvoeren</button>
                <button type="reset">Herladen</button>
                <span class="status pulsing" v-if="loading">Even geduld ...</span>
            </div>
        </form>
    </div>
</template>

<script>
    import AccordionPaneMixin from '../js/accordion-pane-mixin';
    import ApiFormMixin from '../js/api-form-mixin';
    export default {
        mixins: [AccordionPaneMixin, ApiFormMixin],
        data() {
            return {
                name: 'searchForm'
            }
        },

        methods: {
            parseSamples(response) {
                this.sampleOptions = response.body
                    .split(/[\r\n]+/)
                    .filter(line => !line.match(/^#/) && !line.match(/^\s*$/))
                    .map((line) => {
                        const value = line.trim();// `KEYWORD`
                        return {
                            value: value,
                            label: value
                        }
                    })
                ;
            },

            onSubmit() {
                if (this.inputValue) {
                    this.loading = true;
                    location.href = this.endpoint + '?search=' + encodeURIComponent(this.inputValue);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../css/_variables";

    .ld-search-form {
    }
</style>
