export default {
    data() {
        return {
        }
    },
    created() {
        this.initQueryCache();
    },
    methods: {
        initQueryCache() {
            if (this.$store.state.queryCache) { // already registered
                return;
            }

            this.$store.registerModule('queryCache', {
                namespaced: true,
                state: {
                    cached: {}
                },
                mutations: {
                    set(state, mutation) {
                        if (mutation.subField) {
                            state[mutation.field][mutation.subField] = mutation.value;
                        } else {
                            state[mutation.field] = mutation.value;
                        }
                    }
                }
            })
        },

        getCachedQueryResults(query) {
            /** @namespace this.$store.state.queryCache */
            return this.$store.state.queryCache.cached[query] || null;

        },

        setCachedQueryResults(query, results) {
            this.$store.commit('queryCache/set', { field: 'cached', subField: query, value: results });
        }
    }
}
