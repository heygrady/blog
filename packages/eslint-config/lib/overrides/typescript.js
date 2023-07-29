const {
  allExtensions,
  typescriptExtensions,
} = require('../commonExtensions.js')
const { parserServicesRules } = require('../parserServicesRules.js')

module.exports = [
  {
    files: ['**/*.{cts,mts,ts,tsx}', '**/*.d.{cts,mts,ts}'],
    extends: [
      'plugin:import/typescript',
      'standard-with-typescript',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      project: null,
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
        },
        node: {
          extensions: allExtensions,
        },
      },
    },
    parser: '@typescript-eslint/parser',
    rules: {
      // turn off all rules that need parser services
      ...parserServicesRules,
      ...require('../rules/prettier.js'),
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',

      'import/extensions': 'off',
      // https://github.com/weiran-zsd/eslint-plugin-node/issues/47
      // 'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
    },
  },

  // Add a project for ts files within a Typescript src folder
  {
    files: ['src/**/*.{cts,mts,ts,tsx}'],
    extends: [
      'plugin:import/typescript',
      'standard-with-typescript',
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
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
          // FIXME: this plugin should support true for the project field
          // https://www.npmjs.com/package/eslint-import-resolver-typescript#configuration
          project: [
            'apps/*/tsconfig.json',
            'packages/*/tsconfig.json',
            'scripts/*/tsconfig.json',
            'templates/*/tsconfig.json',
          ],
        },
        node: {
          extensions: allExtensions,
        },
      },
    },
    rules: {
      ...require('../rules/prettier.js'),
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',

      'import/extensions': 'off',
      // https://github.com/weiran-zsd/eslint-plugin-node/issues/47
      // 'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
    },
  },

  // Add a project for js files within a Typescript src folder
  {
    files: ['src/**/*.{js,jsx,cjs,mjs}'],
    extends: ['standard', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
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
          project: [
            'apps/*/tsconfig.json',
            'packages/*/tsconfig.json',
            'scripts/*/tsconfig.json',
            'templates/*/tsconfig.json',
          ],
        },
        node: {
          extensions: allExtensions,
        },
      },
    },
    rules: {
      ...require('../rules/prettier.js'),
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
    rules: {
      ...parserServicesRules,
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      // 'n/no-missing-import': 'off',
    },
  },
]
