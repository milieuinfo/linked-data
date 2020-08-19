export default {
    props: {
        active: false
    },
    data() {
        return {
            $paneToggle: null,
            $pane: null
        }
    },
    computed: {
        selectedPane: {
            get() {
                /** @namespace this.$store.state.accordion */
                return this.$store.state.accordion ? this.$store.state.accordion.selectedPane : null;
            },
            set(pane) {
                this.$store.commit('accordion/set', { field: 'selectedPane', value: pane });
            }
        }
    },
    watch: {
        selectedPane(value) {
            if (value === this) {
                // prevent page from shrinking and scrolling up during toggling
                let $content = document.querySelector('#content');
                $content.style.minHeight = $content.getBoundingClientRect().height + 'px';
                // activate pane
                this.$el.classList.add('active');
                this.$pane.style.minHeight = this.calcHeight() + 'px';
                location.hash = this.name;
            } else {
                this.$el.classList.remove('active');
                this.$pane.style.minHeight = 0;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$paneToggle = this.$el.querySelector('.pane-toggle');
            this.$pane = this.$el.querySelector('.pane');
            this.initToggle();
        });
    },
    methods: {
        initToggle() {
            this.$paneToggle.removeEventListener('click', this.togglePane);
            this.$paneToggle.addEventListener('click', this.togglePane);
            if (location.hash && location.hash.match(new RegExp('^#' + this.name))) {
                this.selectedPane = this;
            }
        },

        togglePane() {
            this.selectedPane = (this.selectedPane === this) ? null : this;
        },

        calcHeight() {
            let height = 0;
            this.$el.querySelectorAll('.pane > *').forEach((el) => {
                height += el.getBoundingClientRect().height;
            });
            return height;
        }
    }
}
