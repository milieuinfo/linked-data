
import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import _debounce from 'lodash.debounce';
import './polyfills';


import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Vuex
Vue.use(Vuex);

// Vue Resource
Vue.use(VueResource);

// enable components
Vue.component('department-header', () => import(/* webpackChunkName: "layout" */ '../vue/department-header'));

Vue.component('ld-view', () => import(/* webpackChunkName: "ui" */ '../vue/ld-view'));
Vue.component('ld-card', () => import(/* webpackChunkName: "ui" */ '../vue/ld-card'));
Vue.component('ld-card-title', () => import(/* webpackChunkName: "ui" */ '../vue/ld-card-title'));
Vue.component('ld-card-content', () => import(/* webpackChunkName: "ui" */ '../vue/ld-card-content'));
Vue.component('ld-accordion', () => import(/* webpackChunkName: "ui" */ '../vue/ld-accordion'));
Vue.component('ld-collapsible', () => import(/* webpackChunkName: "ui" */ '../vue/ld-collapsible'));
Vue.component('flex-container', () => import(/* webpackChunkName: "ui" */ '../vue/flex-container'));
Vue.component('flex-item', () => import(/* webpackChunkName: "ui" */ '../vue/flex-item'));

Vue.component('ld-subject', () => import(/* webpackChunkName: "data" */ '../vue/ld-subject'));
Vue.component('ld-predicate', () => import(/* webpackChunkName: "data" */ '../vue/ld-predicate'));
Vue.component('ld-object', () => import(/* webpackChunkName: "data" */ '../vue/ld-object'));
Vue.component('ld-taxonomy', () => import(/* webpackChunkName: "data" */ '../vue/ld-taxonomy'));

Vue.component('ld-lookup-form', () => import(/* webpackChunkName: "api-explorer" */ '../vue/ld-lookup-form'));
Vue.component('ld-sparql-form', () => import(/* webpackChunkName: "api-explorer" */ '../vue/ld-sparql-form'));
Vue.component('ld-search-form', () => import(/* webpackChunkName: "api-explorer" */ '../vue/ld-search-form'));

Vue.component('ld-data-table', () => import(/* webpackChunkName: "data-table" */ '../vue/ld-data-table'));

Vue.component('ld-map', () => import(/* webpackChunkName: "map" */ '../vue/ld-map'));

// HMR, auto-refresh CSS
if (module && module.hot) {
    module.hot.addStatusHandler(status => {
        if (status === 'idle') {
            const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
            styleLinks.forEach((link) => {
                link.setAttribute('href', link.getAttribute('href').replace(/\.css.*$/, '.css?' + Math.random()))
            });
        }
    });
}

// start Vue
setTimeout(() => {
    if (!document.querySelector('#content')) {
        return console.warn('#content element not available');
    }

    window._ = {
        debounce: _debounce
    };

    window.vueApp = new Vue({
        el: '#content',
        store: new Vuex.Store({}),
        http: {
            root: '/',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: true
        }
    });
}, 100);
