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
    external: [
      '@aws-sdk/client-bedrock-agent-runtime',
    ]
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
    external: [
      '@aws-sdk/client-bedrock-agent-runtime',
    ]
  },
];
