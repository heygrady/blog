import astroBase from '../lib/configs/astro-base.js'
import reactBase from '../lib/configs/react-base.js'
import jestOverrides from '../lib/overrides/jest.js'
import testingLibraryOverrides from '../lib/overrides/testingLibrary.js'

export default [
  ...astroBase, // astro-base already includes jsx-a11y
  ...reactBase,
  ...testingLibraryOverrides,
  ...jestOverrides,
]
