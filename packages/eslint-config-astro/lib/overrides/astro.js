// https://github.com/ota-meshi/eslint-plugin-astro#configuration

module.exports = [
  {
    // Define the configuration for `.astro` file.
    files: ['*.astro'],
    globals: {
      astroHTML: true,
    },
    // Allows Astro components to be parsed.
    parser: 'astro-eslint-parser',
    // Parse the script in `.astro` as TypeScript by adding the following configuration.
    // It's the setting you need when using TypeScript.
    parserOptions: {
      parser: '@typescript-eslint/parser',
      extraFileExtensions: ['.astro'],
    },
    rules: {
      'import/extensions': 'off',

      // https://github.com/weiran-zsd/eslint-plugin-node/issues/47
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',

      // prettier-plugin-astro is _very_ buggy, especially when used with eslint-plugin-prettier
      'prettier/prettier': 'off',
    },
  },
  {
    files: ['**/*.md/*.astro', '**/*.md/*.astro/*.js'],
    parserOptions: {
      project: null,
    },
    rules: {},
  },
]
