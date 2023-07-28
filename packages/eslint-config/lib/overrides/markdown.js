const { parserServicesRules } = require('../parserServicesRules.js')

// common md overrides for all configs
module.exports = [
  {
    files: ['**/*.md'],
    extends: 'plugin:markdown/recommended',
  },
  {
    files: ['**/*.md/**'],
    parserOptions: {
      project: null,
    },
  },
  {
    files: [
      '**/*.md/*.astro',
      '**/*.md/*.js',
      '**/*.md/*.jsx',
      '**/*.md/*.ts',
      '**/*.md/*.tsx',
    ],
    parserOptions: {
      ecmaFeatures: {
        impliedStrict: true,
      },
    },
    rules: {
      ...parserServicesRules,
      'no-undef': 'warn',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'n/no-missing-import': 'off',
    },
  },
  {
    files: ['**/*.md/*.ts', '**/*.md/*.tsx'],
    rules: parserServicesRules,
  },
  // https://github.com/eslint/eslint-plugin-markdown/blob/main/examples/react/.eslintrc.js
  {
    files: ['**/*.md/*.jsx', '**/*.md/*.tsx'],
    globals: {
      React: true,
    },
    rules: {
      'react/jsx-no-undef': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]
