import nodeBase from './lib/configs/node-base.js'
import react from './lib/configs/react.js'
import typescript from './lib/configs/typescript.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...nodeBase,
  ...typescript,
  ...react,
  ...testingLibraryOverrides,
  ...vitestOverrides,
]
