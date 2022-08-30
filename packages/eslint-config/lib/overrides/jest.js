module.exports = [
  {
    files: ['**/*.{spec,test}.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
    plugins: ['jest'],
    extends: ['plugin:jest/recommended', 'plugin:jest/style'],
    rules: { 'jest/consistent-test-it': ['error', { fn: 'test' }] },
  },
]
