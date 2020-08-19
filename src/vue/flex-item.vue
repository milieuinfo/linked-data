<template>
    <div class="flex-item" :class="flexClass">
        <slot></slot>
    </div>
</template>

<script>
    import flexMixin from '../js/flex-mixin';
    export default {
        mixins: [flexMixin],
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../css/_variables";

@mixin flex($width) {
    flex-basis: percentage($width);
    flex-grow: 0;
    max-width: percentage($width);
    padding: 0 $flex-gutter-width $flex-gutter-height;

    &.no-gutter {
        padding: 0 0;
    }
}

.flex-item {
    @include flex(1);

    // desktop (>= 1024)
    @media (min-width: $flex-tablet-max-width + 1) {
        &.dsk-25 { @include flex(1/4); }
        &.dsk-33 { @include flex(1/3); }
        &.dsk-50 { @include flex(1/2); }
        &.dsk-66 { @include flex(2/3); }
        &.dsk-75 { @include flex(3/4); }
        &.dsk-100 { @include flex(1); }
    }

    // tablet (600 <=> 1023)
    @media (min-width: $flex-mobile-max-width + 1) and (max-width: $flex-tablet-max-width) {
        &.tab-25 { @include flex(1/4); }
        &.tab-33 { @include flex(1/3); }
        &.tab-50 { @include flex(1/2); }
        &.tab-66 { @include flex(2/3); }
        &.tab-75 { @include flex(3/4); }
        &.tab-100 { @include flex(1); }
    }

    // mobile (< 600)
    @media (max-width: $flex-mobile-max-width) {
        &.mob-25 { @include flex(1/4); }
        &.mob-33 { @include flex(1/3); }
        &.mob-50 { @include flex(1/2); }
        &.mob-66 { @include flex(2/3); }
        &.mob-75 { @include flex(3/4); }
        &.mob-100 { @include flex(1); }
    }
}
</style>
