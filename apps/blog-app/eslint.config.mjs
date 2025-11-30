import astro from '@heygrady/eslint-config/astro.js'

export default [
  // Global ignores
  {
    ignores: ['.turbo/**', 'dist/**', '.astro/**'],
  },

  // Astro config
  ...astro,

  // Blog-app specific: Google Analytics dataLayer global
  // Applied to both .astro files and their virtual script blocks
  {
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    languageOptions: {
      globals: {
        dataLayer: 'readonly',
      },
    },
  },
]
