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
        background-color: #fff;
        margin-bottom: 16px;

        &.dark {
            background-color: $green-dark;
            color: $white;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
