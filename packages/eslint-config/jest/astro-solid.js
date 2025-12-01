import astroBase from '../lib/configs/astro-base.js'
import solid from '../lib/configs/solid.js'
import jestOverrides from '../lib/overrides/jest.js'
import storybookOverrides from '../lib/overrides/storybook.js'
import testingLibraryDomOverrides from '../lib/overrides/testingLibraryDom.js'

export default [
  ...astroBase,
  ...solid,
  ...storybookOverrides,
  ...testingLibraryDomOverrides,
  ...jestOverrides,
]
