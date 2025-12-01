import astroBase from './lib/configs/astro-base.js'
import { solidBase } from './lib/configs/solid.js'
import testingLibraryDomOverrides from './lib/overrides/testingLibraryDom.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...astroBase,
  ...solidBase, // Use solidBase (without jsx-a11y) since astro-base already includes it
  ...testingLibraryDomOverrides,
  ...vitestOverrides,
]
