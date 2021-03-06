import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'source/index.js',
    output: [
        {
            file: 'dist.js',
            format: 'cjs',
        },
        {
            file: 'docs/phaser-plugin-list-view.js',
            format: 'iife',
            name: 'ListViewPlugin',
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs()
    ]
};
