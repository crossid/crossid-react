import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import serve from 'rollup-plugin-serve'

const isProduction = process.env.NODE_ENV === 'production'

export default (async () => ({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'esm',
    },
    {
      name: 'reactCrossid',
      file: 'dist/crossid-react.js',
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
  ],
  plugins: [
    del({ targets: 'dist/*', runOnce: true }),
    resolve(),
    external(),
    typescript(),
    isProduction && (await import('rollup-plugin-terser')).terser(),
    !isProduction &&
      serve({
        contentBase: ['dist', 'playground'],
        open: true,
        port: 3009,
      }),
  ],
}))()
