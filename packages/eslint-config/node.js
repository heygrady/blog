require('@rushstack/eslint-patch/modern-module-resolution')

const { nodeExtensions } = require('./lib/commonExtensions.js')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:compat/recommended',
    'plugin:n/recommended',
    'plugin:import/recommended',
    'plugin:jsdoc/recommended',
    'standard',
    'plugin:prettier/recommended',
  ],
  plugins: ['markdown'],
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
        extensions: nodeExtensions,
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
  ],
}
