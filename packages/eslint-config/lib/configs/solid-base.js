import compat from 'eslint-plugin-compat'
import solid from 'eslint-plugin-solid'
import globals from 'globals'

export default [
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
