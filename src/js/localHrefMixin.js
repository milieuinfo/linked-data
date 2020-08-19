export default {
    data() {
        return {
            subjectBase: null
        }
    },
    mounted() {
        let subject =
            this.resource ||
            document.querySelector('body').getAttribute('about') ||
            location.href;
        this.subjectBase = subject.replace(/^(.+:\/\/[^\/]+)\/.*$/, '$1');// e.g. https://data.imjv.omgeving.vlaanderen.be
    },
    methods: {
        onClick(event) {
            // check if clicked element is a link
            if (!event.target.hasAttribute('href')) {
                return true;
            }

            // check if clicked link is from same URI space
            let href = event.target.getAttribute('href');
            if (href.indexOf(this.subjectBase) !== 0) {
                return true;
            }

            // redirect to local href instead of official URI
            event.preventDefault();
            location.href = href.replace(this.subjectBase + '/', '/');
        }
    }
}
