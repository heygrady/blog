import compat from 'eslint-plugin-compat'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

import reactSettings from '../settings/react.js'

import jsxA11yConfig from './jsx-a11y.js'

// Base react config without jsx-a11y (for use with astro which already includes it)
export const reactBase = [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
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
    settings: {
      ...reactSettings,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // React 17+ doesn't need React in scope for JSX
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      // Allow @testing-library/jest-dom as unpublished import in test files
      'n/no-unpublished-import': [
        'error',
        { allowModules: ['@testing-library/jest-dom'] },
      ],
    },
  },
]

// Full react config including jsx-a11y (for standalone use without astro)
export default [...reactBase, ...jsxA11yConfig]
