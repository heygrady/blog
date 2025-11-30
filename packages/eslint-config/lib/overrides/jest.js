import jest from 'eslint-plugin-jest'

export default [
  {
    files: ['**/*.{spec,test}.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: jest.environments.globals.globals,
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      ...jest.configs['flat/style'].rules,
      'jest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
]
