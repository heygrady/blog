import jsxA11y from 'eslint-plugin-jsx-a11y'

// Shared jsx-a11y config for JSX accessibility
export default [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },
]
