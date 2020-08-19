<template>
    <div class="ld-accordion">
        <div class="panes">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },

        mounted() {
            this.initStore();
        },

        methods: {
            initStore() {
                this.$store.registerModule('accordion', {
                    namespaced: true,
                    state: {
                        selectedPane: null
                    },
                    mutations: {
                        set(state, mutation) {
                            if (mutation.subField) {
                                state[mutation.field][mutation.subField] = mutation.value;
                            } else {
                                state[mutation.field] = mutation.value;
                            }
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    @import "../css/_variables";

    .ld-accordion {

        .panes > * {
            border-bottom: 1px solid $grey;

            > .pane-toggle {
                border-left: 2px solid transparent;
                transition: border-left-color 1s;
                padding: 16px;
                cursor: pointer;
            }

            > .pane {
                min-height: 0;
                height: 1px;
                overflow: hidden;
                position: relative;
                border-left: 2px solid transparent;
                transition: border-left-color 1s, min-height 1s;
            }

            &.active {
                > .pane-toggle {
                    border-left: 2px solid $green;
                }

                > .pane {
                    border-left: 2px solid $green;
                }
            }
        }
    }
</style>
