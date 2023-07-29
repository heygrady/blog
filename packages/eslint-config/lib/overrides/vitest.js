module.exports = [
  {
    files: ['**/*.{bench,spec,test}.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
    extends: ['plugin:vitest/recommended'],
    parserOptions: {
      project: null,
    },
    rules: {
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
]
