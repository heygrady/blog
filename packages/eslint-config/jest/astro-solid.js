import astroBase from '../lib/configs/astro-base.js'
import solidBase from '../lib/configs/solid-base.js'
import jestOverrides from '../lib/overrides/jest.js'
import testingLibraryDomOverrides from '../lib/overrides/testingLibraryDom.js'

export default [
  ...astroBase, // astro-base already includes jsx-a11y
  ...solidBase,
  ...testingLibraryDomOverrides,
  ...jestOverrides,
]
