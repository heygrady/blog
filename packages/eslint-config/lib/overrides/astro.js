// https://github.com/ota-meshi/eslint-plugin-astro#configuration
// Astro-specific overrides for rules that conflict with Astro components

export default [
  {
    // Define the configuration for `.astro` file.
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        astroHTML: 'readonly',
      },
    },
    rules: {
      'import/extensions': 'off',

      // eslint-plugin-n can't resolve Astro imports properly
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',

      // prettier-plugin-astro has ongoing ESLint integration issues
      // https://github.com/withastro/prettier-plugin-astro/issues/451 - TS rule crashes
      // https://github.com/withastro/prettier-plugin-astro/issues/326 - parsing errors
      'prettier/prettier': 'off',
    },
  },
  {
    // Virtual files for <script> blocks in Astro components (e.g., Footer.astro/1_0.js)
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    rules: {
      // eslint-plugin-n can't resolve imports in Astro virtual files
      'n/no-missing-import': 'off',
    },
  },
  {
    files: ['**/*.md/*.astro', '**/*.md/*.astro/*.js'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {},
  },
]
