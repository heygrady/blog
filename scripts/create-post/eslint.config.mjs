import zx from '@heygrady/eslint-config/zx.js'

export default [
  // Global ignores
  {
    ignores: ['.turbo/**', 'dist/**', 'coverage/**'],
  },

  // ZX config (includes node config + zx globals)
  ...zx,
]
