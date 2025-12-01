import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

import typescriptOverrides from '../overrides/typescript.js'

export default [
  // Add TypeScript support for .ts/.tsx files
  {
    files: ['**/*.{cts,mts,ts,tsx}'],
    ignores: ['**/*.md/*'],
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

  // TypeScript-specific overrides (type-aware linting, import resolution, etc.)
  ...typescriptOverrides,
]
