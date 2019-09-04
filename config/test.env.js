'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
	NODE_ENV: '"production"',
	BASE_URL: '"http://192.168.0.144:8051"',
	APPID: '"wx0a542ef9d4d41cef"'
})
