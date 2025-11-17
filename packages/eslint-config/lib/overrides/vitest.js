export default [
  {
    files: ['**/*.{bench,spec,test}.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
    extends: ['plugin:vitest/recommended'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
]
