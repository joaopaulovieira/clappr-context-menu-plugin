import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const plugins = [
  babel({ exclude: 'node_modules/**' }),
  html(),
  postcss(),
  size(),
  filesize(),
]

dev && plugins.push(
  serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  livereload({ watch: ['dist', 'public'] }),
)

analyzeBundle && plugins.push(visualize({ open: true }))

const rollupConfig = [
  {
    input: 'src/context_menu.js',
    external: ['@clappr/core'],
    output: {
      name: 'ContextMenuPlugin',
      file: pkg.main,
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
    },
    plugins: [
      resolve(),
      commonjs(),
      ...plugins,
    ],
  },
  {
    input: 'src/context_menu.js',
    external: ['@clappr/core'],
    output: [
      {
        name: 'ContextMenuPlugin',
        file: pkg.module,
        format: 'esm',
        globals: { '@clappr/core': 'Clappr' },
      },
    ],
    plugins,
  },
]

minimize && rollupConfig.push(
  {
    input: 'src/context_menu.js',
    external: ['@clappr/core'],
    output: [
      {
        name: 'ContextMenuPlugin',
        file: 'dist/clappr-context-menu-plugin.min.js',
        format: 'umd',
        globals: { '@clappr/core': 'Clappr' },
      },
    ],
    plugins: [
      ...plugins,
      terser({ include: [/^.+\.min\.js$/] }),
    ],
  },
)

export default rollupConfig
