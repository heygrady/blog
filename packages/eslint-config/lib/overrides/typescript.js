const pkgDir = require('pkg-dir')

const {
  allExtensions,
  typescriptExtensions,
} = require('../commonExtensions.js')

const root = pkgDir.sync()

module.exports = [
  {
    files: ['**/*.{cts,mts,ts,tsx}', '**/*.d.{cts,mts,ts}'],
    extends: ['plugin:import/typescript'],
    settings: {
      'import/extensions': allExtensions,
      'import/parsers': {
        '@typescript-eslint/parser': typescriptExtensions,
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          extensions: typescriptExtensions,
          project: `${root}/tsconfig.json`,
        },
        node: {
          extensions: allExtensions,
        },
      },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: `${root}/tsconfig.json`,
      tsconfigRootDir: root,
    },
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      'import/extensions': 'off',
      // https://github.com/weiran-zsd/eslint-plugin-node/issues/47
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
    },
  },
  // Parse js files within a Typescript src folder
  {
    files: ['src/**/*.{js,jsx,cjs,mjs}'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: `${root}/tsconfig.json`,
      tsconfigRootDir: root,
    },
    settings: {
      'import/extensions': allExtensions,
      'import/parsers': {
        '@typescript-eslint/parser': typescriptExtensions,
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          extensions: typescriptExtensions,
          project: `${root}/tsconfig.json`,
        },
        node: {
          extensions: allExtensions,
        },
      },
    },
    rules: {
      'import/extensions': 'off',
      // https://github.com/weiran-zsd/eslint-plugin-node/issues/47
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
    },
  },
  // Fixes collision with markdown files
  {
    files: ['**/src/**/*.md/*.{js,jsx,ts,tsx}'],
    parserOptions: {
      project: null,
    },
  },
]
