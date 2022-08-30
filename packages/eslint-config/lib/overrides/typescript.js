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
    parserOptions: {
      project: `${root}/tsconfig.json`,
      tsconfigRootDir: root,
    },
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      'import/extensions': 'off',
      // https://github.com/weiran-zsd/eslint-plugin-node/issues/47
      'n/no-missing-import': 'off',
    },
  },
]
