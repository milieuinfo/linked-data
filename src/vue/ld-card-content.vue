<template>
    <div class="ld-card-content">
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

    .ld-card-content {
        padding: 14px 16px 16px;
    }
</style>
