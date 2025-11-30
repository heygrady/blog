import vitest from 'eslint-plugin-vitest'

export default [
  {
    files: ['**/*.{bench,spec,test}.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
    plugins: {
      vitest,
    },
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
]
