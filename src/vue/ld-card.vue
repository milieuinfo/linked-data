<template>
    <div class="ld-card">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../css/_variables";

    .ld-card {
        @include box-shadow();
        background-color: $card-bg-color;
        margin-bottom: 16px;

        &.dark {
            background-color: $card-bg-color-dark;
            color: $card-color;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
