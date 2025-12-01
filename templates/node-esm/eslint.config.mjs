import node from '@heygrady/eslint-config/jest/node.js'

export default [
  // Global ignores
  {
    ignores: ['.turbo/**', 'dist/**', 'coverage/**'],
  },

  // Node config (with Jest)
  ...node,
]
