<template>
    <ld-card class="ld-collapsible">
        <ld-card-title class="dark">
            <div class="title" @click="toggleContent">
                <v-icon class="toggle-arrow" :class="{ expanded: expanded }">chevron_right</v-icon>
                {{ title }}
            </div>
        </ld-card-title>
        <div class="collapsible-content" :class="{ collapsed: !expanded }">
            <ld-card-content>
                <slot></slot>
            </ld-card-content>
        </div>
    </ld-card>
</template>

<script>
    export default {
        props: {
            title: String,
            collapsed: Boolean
        },
        data() {
            return {
                expanded: false,
                checkTimeout: null
            }
        },
        mounted() {
            this.expanded = !this.collapsed;
            // allow child components to emit 'contentChanged' events to this component
            this.$el.component = this;
            this.$on('contentChanged', (event) => {
                this.checkExpansion()
            });
        },
        watch: {
            expanded(value) {
                this.checkExpansion();
            }
        },
        methods: {
            toggleContent() {
                this.expanded = !this.expanded;
            },

            checkExpansion() {
                if (!this.$el || !this.$el.querySelector) {
                    return setTimeout(this.checkExpansion, 100);
                }

                clearTimeout(this.checkTimeout);

                // prevent page from shrinking and scrolling up during toggling
                let $canvas = document.querySelector('#content');
                $canvas.style.minHeight = $canvas.getBoundingClientRect().height + 'px';

                // expand/collapse content
                let $content = this.$el.querySelector('.collapsible-content');
                $content.style.minHeight = this.expanded
                    ? this.calcHeight() + 'px'
                    : 0;

                this.checkTimeout = setTimeout(this.checkExpansion, 1000);
            },

            calcHeight() {
                let height = 0;
                this.$el.querySelectorAll('.collapsible-content > *').forEach((el) => {
                    height += el.getBoundingClientRect().height;
                });
                return height;
            }
        }
    }
</script>

<style lang="scss">
    @import "../css/_variables";

    .ld-collapsible {

        .ld-card-title {
            background-color: $green !important;

            .title {
                display: inline-block;
                cursor: pointer;

                .toggle-arrow {
                    font-size: 22px;
                    transition: transform 1s;

                    &.expanded {
                        transform: rotate(90deg);
                    }
                }
            }
        }

        .collapsible-content {
            overflow: hidden;
            position: relative;
            transition: min-height 1s, padding-top 1s;
            height: 1px;
            min-height: 0;

            &.collapsed {
                margin-top: -1px;
            }

            .ld-card-content {
                padding-top: 0;
                padding-bottom: 0;
            }
        }
    }
</style>
