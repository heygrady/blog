import node from '@heygrady/eslint-config/node.js'

export default [
  // Global ignores
  {
    ignores: ['.turbo/**', 'dist/**', 'coverage/**'],
  },

  // Node config
  ...node,
]
