const path = require('path');
const config = require('./webpack.common');

config.entry = './src/index.js',
config.output = {
	path: path.join(__dirname, "dist"),
	filename: 'paella-user-tracking.js',
	library: 'paella-user-tracking',
	libraryTarget: 'umd'
};

module.exports = config;