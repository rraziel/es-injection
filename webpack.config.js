const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const sourcePath = path.join(__dirname, '/src');
const destinationPath = path.resolve(__dirname, 'dist');
const entryConfig = {
    'es-injection': path.resolve(sourcePath, 'index.ts')
};
const moduleConfig = {
    rules: [{
        test: /\.ts$/,
        exclude: [
            /node_modules/
        ],
        use: {
            loader: 'ts-loader'
        }
    }]
};
const resolveConfig = {
    extensions: [
        '.js',
        '.ts'
    ],
    modules: [
        './node_modules',
        './src'
    ]
};

const nodeConfig = {
    target: 'node',
    devtool: 'source-map',
    entry: entryConfig,
    module: moduleConfig,
    output: {
        path: destinationPath,
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: resolveConfig
};

const webConfig = {
    target: 'web',
    devtool: 'source-map',
    entry: entryConfig,
    module: moduleConfig,
    output: {
        path: destinationPath,
        filename: '[name].min.js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    resolve: resolveConfig
};

module.exports = [nodeConfig, webConfig];
