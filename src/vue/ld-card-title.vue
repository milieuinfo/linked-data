<template>
    <div class="ld-card-title" :class="{'has-img': img}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: ['img'],
        data() {
            return {
            }
        },
        mounted() {
            if (this.img) {
                this.$el.style.backgroundImage = 'url(' + this.img + ')';
            }
        }
    }
</script>

<style lang="scss">
    @import "../css/_variables";

    .ld-card-title {
        padding: 8px 16px 9px 16px;
        line-height: 28px;
        font-family: $font-header-light;
        font-size: 20px;
        color: $card-title-color;
        background-color: $card-title-bg-color;
        border-bottom: 1px solid $green;

        a {
            color: $card-title-color !important;
        }

        &.dark {
            color: $card-title-color-dark;
            background-color: $card-title-bg-color-dark;
            border-bottom: none;

            a {
                color: $card-title-color-dark !important;
            }
        }

        &.has-img {
            background-size: cover;
            background-position: top center;
            padding-top: 80px;
        }
    }
</style>
