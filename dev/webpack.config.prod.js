let config = require('./webpack.config.base.js');
config.mode = 'production';
config.resolve.alias.vue = 'vue/dist/vue.min.js';
module.exports = config;
