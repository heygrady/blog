import jsxA11y from './lib/configs/jsx-a11y.js'
import nodeBase from './lib/configs/node-base.js'
import reactBase from './lib/configs/react-base.js'
import typescript from './lib/configs/typescript.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...nodeBase,
  ...typescript,
  ...reactBase,
  ...jsxA11y,
  ...testingLibraryOverrides,
  ...vitestOverrides,
]
