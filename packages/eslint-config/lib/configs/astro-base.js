import astroPlugin from 'eslint-plugin-astro'

import astroOverrides from '../overrides/astro.js'

import nodeBase from './node-base.js'
import typescript from './typescript.js'

export default [
  // Start with the node.js base config (includes import/resolver settings)
  ...nodeBase,

  // Add TypeScript support (reuse shared typescript config)
  ...typescript,

  // Astro plugin flat configs
  ...astroPlugin.configs['flat/recommended'],
  ...astroPlugin.configs['flat/jsx-a11y-recommended'],

  // Astro-specific overrides
  ...astroOverrides,
]
