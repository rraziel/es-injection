const createWebpackConfig = require('../webpack.base.js');

const nodeConfig = createWebpackConfig('metadata', 'node');
const webConfig = createWebpackConfig('metadata', 'web');

module.exports = [nodeConfig, webConfig];
