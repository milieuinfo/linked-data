<template>
    <div class="flex-container" :class="{stretch: align === 'stretch', 'no-gutter': noGutter}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            'align': String,
            'noGutter': Boolean
        },
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss">
@import "../css/_variables";

.flex-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex: 1 1 auto;
    margin-left: -$flex-gutter-width;
    margin-right: -$flex-gutter-width;

    &.no-gutter {
      margin-left: 0;
      margin-right: 0;
    }

    &.stretch {
        align-items: stretch;
        align-content: stretch;

        .flex-item > * {
            height: 100%;
        }
    }
}
</style>
