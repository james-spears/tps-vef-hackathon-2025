import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/autocomplete.ts',
    output: {
      file: './dist/autocomplete.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.ts'],
      }),
      typescript({ sourceMap: true }),
    ],
  },
  {
    input: 'src/query.ts',
    output: {
      file: './dist/query.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.ts'],
      }),
      typescript({ sourceMap: true }),
    ],
  },
];
