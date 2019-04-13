const createWebpackConfig = require('../webpack.base.js');

const nodeConfig = createWebpackConfig('sample', 'node');
const webConfig = createWebpackConfig('sample', 'web');

module.exports = [nodeConfig, webConfig];
