import astroBase from './lib/configs/astro-base.js'
import solid from './lib/configs/solid.js'
import storybookOverrides from './lib/overrides/storybook.js'
import testingLibraryDomOverrides from './lib/overrides/testingLibraryDom.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...astroBase,
  ...solid,
  ...storybookOverrides,
  ...testingLibraryDomOverrides,
  ...vitestOverrides,
]
