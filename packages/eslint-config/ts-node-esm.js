require('@rushstack/eslint-patch/modern-module-resolution')

const { allExtensions } = require('./lib/commonExtensions.js')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:compat/recommended',
    'plugin:n/recommended',
    'plugin:import/recommended',
    'plugin:jsdoc/recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'markdown'],
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: allExtensions,
      },
    },
    jsdoc: {
      mode: 'typescript',
    },
  },
  rules: {
    ...require('./lib/rules/common.js'),
    ...require('./lib/rules/import.js'),
    ...require('./lib/rules/jsdoc.js'),
    ...require('./lib/rules/node.js'),
    ...require('./lib/rules/prettier.js'),
  },
  overrides: [
    ...require('./lib/overrides/configFiles.js'),
    ...require('./lib/overrides/jest.js'),
    ...require('./lib/overrides/json.js'),
    ...require('./lib/overrides/markdown.js'),
    ...require('./lib/overrides/typescript.js'),
  ],
}
