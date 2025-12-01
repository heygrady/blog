import astroBase from './lib/configs/astro-base.js'
import markdownOverrides from './lib/overrides/markdown.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [...astroBase, ...vitestOverrides, ...markdownOverrides]
