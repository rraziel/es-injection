const createWebpackConfig = require('../webpack.base.js');

const nodeConfig = createWebpackConfig('core', 'node');
const webConfig = createWebpackConfig('core', 'web');

module.exports = [nodeConfig, webConfig];
