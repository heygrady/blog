import nodeBase from './lib/configs/node-base.js'
import typescript from './lib/configs/typescript.js'
import markdownOverrides from './lib/overrides/markdown.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...nodeBase,
  ...typescript,
  ...vitestOverrides,
  ...markdownOverrides,
]
