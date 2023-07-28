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
    'plugin:prettier/recommended',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
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
    ...require('@heygrady/eslint-config/lib/rules/common.js'),
    ...require('@heygrady/eslint-config/lib/rules/import.js'),
    ...require('@heygrady/eslint-config/lib/rules/jsdoc.js'),
    ...require('@heygrady/eslint-config/lib/rules/node.js'),
    ...require('./lib/rules/prettier.js'),
  },
  overrides: [
    ...require('@heygrady/eslint-config/lib/overrides/configFiles.js'),
    ...require('@heygrady/eslint-config/lib/overrides/json.js'),
    ...require('@heygrady/eslint-config/lib/overrides/markdown.js'),
    ...require('@heygrady/eslint-config/lib/overrides/typescript.js'),
    ...require('./lib/overrides/astro.js'),
    ...require('./lib/overrides/astroConfig.js'),
    ...require('./lib/overrides/src.js'),
    ...require('./lib/overrides/vitest.js'),
  ],
}
