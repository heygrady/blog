import astroBase from './lib/configs/astro-base.js'
import reactBase from './lib/configs/react-base.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...astroBase, // astro-base already includes jsx-a11y
  ...reactBase,
  ...testingLibraryOverrides,
  ...vitestOverrides,
]
