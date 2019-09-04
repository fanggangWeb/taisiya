'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	BASE_URL: '"http://39.104.99.107:8088"',
	APPID: '"wx0a542ef9d4d41cef"'
})
