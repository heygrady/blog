import markdown from '@eslint/markdown'

import { parserServicesRules } from '../parserServicesRules.js'

// common md overrides for all configs
export default [
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    processor: 'markdown/markdown',
    rules: {
      ...markdown.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.md/**'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
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
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
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
  // Override for CommonJS code blocks in Markdown files
  {
    files: ['**/*.md/*.js', '**/*.md/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      'n/no-extraneous-require': 'off',
    },
  },
]
