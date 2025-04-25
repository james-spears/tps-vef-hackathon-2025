import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/autocomplete.ts',
    output: {
      file: './dist/autocomplete.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.ts'],
      }),
      typescript({ sourceMap: true }),
      terser(),
    ],
  },
  {
    input: 'src/query.ts',
    output: {
      file: './dist/query.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.ts'],
      }),
      typescript({ sourceMap: true }),
      terser(),
    ],
  },
];
