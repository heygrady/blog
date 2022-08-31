require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:compat/recommended',
    'plugin:jsdoc/recommended',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'markdown'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  rules: {
    ...require('./lib/rules/common.js'),
    ...require('./lib/rules/jsdoc.js'),
    ...require('./lib/rules/prettier.js'),
  },
  overrides: [
    ...require('./lib/overrides/astro.js'),
    ...require('./lib/overrides/configFiles.js'),
    ...require('./lib/overrides/json.js'),
    ...require('./lib/overrides/markdown.js'),
    ...require('./lib/overrides/typescript.js'),
  ],
}
