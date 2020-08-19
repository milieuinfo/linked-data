<template>
    <flex-container class="ld-subject" :about="subject">
        <slot></slot>
    </flex-container>
</template>

<script>
    export default {
        props: ['about'],
        data() {
            return {
            }
        },
        computed: {
            subject() {
                return this.about
                    || document.querySelector('body').getAttribute('about')
                    || location.href
            }
        }
    }
</script>

<style lang="scss">
@import "../css/_variables";

.ld-subject {
    padding-top: 32px;
    font-size: 16px;
}

hr + .ld-subject {
    padding-top: 16px;
}

.ld-card-content .ld-subject:first-child {
    padding-top: 16px;
}
</style>
