import node from './node.js'

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: ['.turbo/**', 'dist/**', 'coverage/**', 'CHANGELOG.md'],
  },

  // Main config
  ...node,
]
