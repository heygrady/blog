import compat from 'eslint-plugin-compat'
import solid from 'eslint-plugin-solid'
import globals from 'globals'

import jsxA11yConfig from './jsx-a11y.js'

// Base solid config without jsx-a11y (for use with astro which already includes it)
export const solidBase = [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      solid: solid,
      compat,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Use flat/typescript preset rules
      ...solid.configs['flat/typescript'].rules,
      // Allow @testing-library/jest-dom as unpublished import in test files
      'n/no-unpublished-import': [
        'error',
        { allowModules: ['@testing-library/jest-dom'] },
      ],
    },
  },
]

// Full solid config including jsx-a11y (for standalone use without astro)
export default [...solidBase, ...jsxA11yConfig]
