import astroBase from '../lib/configs/astro-base.js'
import react from '../lib/configs/react.js'
import jestOverrides from '../lib/overrides/jest.js'
import storybookOverrides from '../lib/overrides/storybook.js'
import testingLibraryOverrides from '../lib/overrides/testingLibrary.js'

export default [
  ...astroBase,
  ...react,
  ...storybookOverrides,
  ...testingLibraryOverrides,
  ...jestOverrides,
]
