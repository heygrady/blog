import astroBase from './lib/configs/astro-base.js'
import { reactBase } from './lib/configs/react.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...astroBase,
  ...reactBase, // Use reactBase (without jsx-a11y) since astro-base already includes it
  ...testingLibraryOverrides,
  ...vitestOverrides,
]
