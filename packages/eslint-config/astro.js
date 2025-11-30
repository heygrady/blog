import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import astroPlugin from 'eslint-plugin-astro'

import astroOverrides from './lib/overrides/astro.js'
import typescriptOverrides from './lib/overrides/typescript.js'
import vitestOverrides from './lib/overrides/vitest.js'
import nodeConfig from './node.js'

export default [
  // Start with the node.js base config (includes import/resolver settings)
  ...nodeConfig,

  // Add TypeScript support (from ts-node-esm pattern)
  {
    files: ['**/*.{cts,mts,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // TypeScript overrides
  ...typescriptOverrides,

  // Astro plugin flat configs
  ...astroPlugin.configs['flat/recommended'],
  ...astroPlugin.configs['flat/jsx-a11y-recommended'],

  // Astro-specific overrides
  ...astroOverrides,

  // Vitest overrides
  ...vitestOverrides,
]
