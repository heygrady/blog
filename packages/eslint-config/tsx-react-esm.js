import compat from 'eslint-plugin-compat'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

import storybookOverrides from './lib/overrides/storybook.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import reactSettings from './lib/settings/react.js'
import tsNodeConfig from './ts-node-esm.js'

export default [
  // Start with the ts-node-esm config
  ...tsNodeConfig,

  // Add React and JSX support
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
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
      ...jsxA11y.configs.recommended.rules,
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

  // Storybook overrides
  ...storybookOverrides,

  // Testing Library overrides
  ...testingLibraryOverrides,
]
