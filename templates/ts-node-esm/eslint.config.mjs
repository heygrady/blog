import tsNodeEsm from '@heygrady/eslint-config/ts-node-esm.js'

export default [
  // Global ignores
  {
    ignores: ['.turbo/**', 'dist/**', 'coverage/**'],
  },

  // TypeScript Node ESM config
  ...tsNodeEsm,
]
