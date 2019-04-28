const autoExternals = require('rollup-plugin-auto-external');
const nodeResolve = require('rollup-plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');
const typescript = require('rollup-plugin-typescript2');

function createRollupConfig(libraryName) {
    const pkg = require('./' + libraryName + '/package.json');

    return ['umd', 'es'].map(format => ({
        input: 'src/index.ts',
        output: {
            file: (format === 'umd') ? pkg.main : pkg.module,
            name: (format === 'umd') ? libraryName : undefined,
            format: format,
            sourcemap: true
        },
        plugins: [
            autoExternals({
                dependencies: format === 'es'
            }),
            typescript({useTsconfigDeclarationDir: true}),
            nodeResolve(),
            sourcemaps()
        ]
    }));
}

module.exports = createRollupConfig;
