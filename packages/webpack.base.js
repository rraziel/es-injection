const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

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
const optimizationConfig = {
    minimizer: [new TerserPlugin()]
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

function createWebpackConfig(name, target) {
    const sourcePath = path.join(__dirname, name, 'src');
    const destinationPath = path.resolve(__dirname, name, 'lib');
    const baseConfig = {
        target: target,
        entry: {},
        externals: [
            nodeExternals(),
            /\@es-injection\/.+$/
        ],
        devtool: 'source-map',
        module: moduleConfig,
        output: {
            path: destinationPath,
            filename: 'es-injection-[name].js',
            library: '[name]',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        resolve: resolveConfig
    };
    
    baseConfig.entry[name] = path.resolve(sourcePath, 'index.ts');

    if (target === 'web') {
        baseConfig.optimization = optimizationConfig;
        baseConfig.output.filename = 'es-injection-[name].min.js';
    }

    return baseConfig;
}

module.exports = createWebpackConfig;
