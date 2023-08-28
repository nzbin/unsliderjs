import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const banner = String.raw`/*!
 * ${pkg.name} - v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 *
 * Copyright 2023-present ${pkg.author}
 * Released under ${pkg.license} License
 */
`;

export default [
  {
    input: 'src/js/unslider.js',
    output: [
      {
        file: 'dist/unslider.js',
        name: 'Unslider',
        banner,
        format: 'umd'
      },
      {
        file: 'dist/unslider.common.js',
        banner,
        format: 'cjs',
        exports: 'auto',
      },
      {
        file: 'dist/unslider.esm.js',
        banner,
        format: 'es'
      }
    ],
    plugins: [
      babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
      commonjs(),
      resolve(),
    ]
  }
];
