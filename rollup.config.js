/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import autoExternal from 'rollup-plugin-auto-external';

import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.browser,
        format: 'umd',
        sourceMap: true,
        name: 'KNoTWebSocket',
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
      babel({
        exclude: [
          'node_modules/**',
        ],
        externalHelpers: false,
        runtimeHelpers: true,
      }),
      globals(),
      builtins(),
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourceMap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourceMap: true,
      },
    ],
    plugins: [
      autoExternal({
        builtins: '6.0.0',
      }),
      babel({
        exclude: [
          'node_modules/**',
        ],
        externalHelpers: false,
        runtimeHelpers: true,
      }),
      resolve(),
      commonjs(),
    ],
  },
];
