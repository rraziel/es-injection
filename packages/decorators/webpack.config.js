const createWebpackConfig = require('../webpack.base.js');

const nodeConfig = createWebpackConfig('decorators', 'node');
const webConfig = createWebpackConfig('decorators', 'web');

module.exports = [nodeConfig, webConfig];
