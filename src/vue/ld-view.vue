<template>
    <div class="ld-view">
        <department-header :activeurl="activeurl">
            <a href="https://www.vlaanderen.be/nl">Vlaanderen</a>
            <a href="https://www.lne.be/">Departement Omgeving</a>
            <a href="/">Linked Data</a>
        </department-header>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            activeurl: String
        },
        data() {
            return {}
        },
        computed: {},
        mounted() {
            document.querySelector('body').style.opacity = 1;
        },
        methods: {}
    }
</script>

<style lang="scss">
    @import "../css/theme";
</style>
<style lang="scss" scoped>
    @import "../css/_variables";

    .ld-view {
        > .content {
            @include layout();
        }
    }
</style>
