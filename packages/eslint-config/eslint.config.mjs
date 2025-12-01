import tsNodeEsm from './ts-node-esm.js'

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      '.turbo/**',
      'dist/**',
      'coverage/**',
      'CHANGELOG.md',
      // Test fixtures may have intentionally invalid code
      'test/fixtures/**',
      // Snapshot files
      'test/**/__snapshots__/**',
    ],
  },

  // Main config - use ts-node-esm to lint TypeScript test files
  ...tsNodeEsm,
]
