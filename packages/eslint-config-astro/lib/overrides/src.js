module.exports = [
  {
    // FIXME: add astro extension
    files: ['src/**/*.{mjs,js,jsx,mts,ts,tsx}'],
    rules: {
      'import/extensions': 'off',
      'import/no-unresolved': ['error', { ignore: ['^@astrojs\\/'] }],
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
    files: ['**/*.md/*.js', '**/*.md/*.jsx', '**/*.md/*.ts', '**/*.md/*.tsx'],
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
