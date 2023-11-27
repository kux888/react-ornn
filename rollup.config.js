import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.js',

  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    exports: 'named',
  },

  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],

  external:['react', 'react-dom']
};