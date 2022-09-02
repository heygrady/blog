module.exports = [
  {
    files: ['src/**/*.{astro,mjs,js,jsx,mts,ts,tsx}'],
    rules: {
      'import/extensions': 'off',
      'n/file-extension-in-import': [
        'error',
        'always',
        { '.js': 'never', '.ts': 'never' },
      ],
      'n/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
    },
  },
  {
    files: ['**/*.md/*.{astro,mjs,js,jsx,mts,ts,tsx}'],
    rules: {
      'import/no-unresolved': 'off',
      'n/file-extension-in-import': [
        'warn',
        'always',
        { '.js': 'never', '.ts': 'never' },
      ],
    },
  },
]
