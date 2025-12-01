import tseslint from '@typescript-eslint/eslint-plugin'
import vitest from 'eslint-plugin-vitest'

export default [
  // JavaScript test files
  {
    files: ['**/*.{spec,test}.{cjs,mjs,js,jsx}'],
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
  // TypeScript test files
  {
    files: ['**/*.{spec,test}.{cts,mts,ts,tsx}'],
    plugins: {
      vitest,
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      // Relax strict typing in tests - test code often needs more flexibility
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Benchmark files - use bench() not test()
  {
    files: ['**/*.bench.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
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
      // Benchmarks use bench(), not test/it
      'vitest/consistent-test-it': 'off',
      'vitest/expect-expect': 'off',
    },
  },
]
