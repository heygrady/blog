import compat from 'eslint-plugin-compat'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import solid from 'eslint-plugin-solid'
import globals from 'globals'

export default [
  // Add Solid and JSX support
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      solid: solid,
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
    rules: {
      // Use flat/typescript preset rules
      ...solid.configs['flat/typescript'].rules,
      ...jsxA11y.configs.recommended.rules,
      // Allow @testing-library/jest-dom as unpublished import in test files
      'n/no-unpublished-import': [
        'error',
        { allowModules: ['@testing-library/jest-dom'] },
      ],
    },
  },
]
