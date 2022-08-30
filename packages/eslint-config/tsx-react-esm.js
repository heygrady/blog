require('@rushstack/eslint-patch/modern-module-resolution')

const { allExtensions } = require('./lib/commonExtensions.js')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:compat/recommended',
    'plugin:n/recommended',
    'plugin:import/recommended',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:storybook/recommended',
    'standard-with-typescript',
    'standard-jsx',
    'standard-react',
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

    'n/no-unpublished-import': [
      'error',
      { allowModules: ['@testing-library/jest-dom'] },
    ],

    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    ...require('./lib/overrides/configFiles.js'),
    ...require('./lib/overrides/jest.js'),
    ...require('./lib/overrides/json.js'),
    ...require('./lib/overrides/markdown.js'),
    ...require('./lib/overrides/storybook.js'),
    ...require('./lib/overrides/testingLibrary.js'),
    ...require('./lib/overrides/typescript.js'),
  ],
}
