import nodeBase from './lib/configs/node-base.js'
import solid from './lib/configs/solid.js'
import typescript from './lib/configs/typescript.js'
import testingLibraryDomOverrides from './lib/overrides/testingLibraryDom.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...nodeBase,
  ...typescript,
  ...solid,
  ...testingLibraryDomOverrides,
  ...vitestOverrides,
]
