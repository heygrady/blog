import nodeBase from '../lib/configs/node-base.js'
import react from '../lib/configs/react.js'
import typescript from '../lib/configs/typescript.js'
import jestOverrides from '../lib/overrides/jest.js'
import storybookOverrides from '../lib/overrides/storybook.js'
import testingLibraryOverrides from '../lib/overrides/testingLibrary.js'

export default [
  ...nodeBase,
  ...typescript,
  ...react,
  ...storybookOverrides,
  ...testingLibraryOverrides,
  ...jestOverrides,
]
