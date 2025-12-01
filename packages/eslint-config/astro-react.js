import astroBase from './lib/configs/astro-base.js'
import react from './lib/configs/react.js'
import storybookOverrides from './lib/overrides/storybook.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [
  ...astroBase,
  ...react,
  ...storybookOverrides,
  ...testingLibraryOverrides,
  ...vitestOverrides,
]
