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
    files: ['**/*.md/*.js', '**/*.md/*.jsx', '**/*.md/*.ts', '**/*.md/*.tsx'],
    parserOptions: {
      ecmaFeatures: {
        impliedStrict: true,
      },
    },
    rules: {
      'no-undef': 'warn',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'n/no-missing-import': 'off',
    },
  },
  {
    files: ['**/*.md/*.ts', '**/*.md/*.tsx'],
    rules: {
      // disable typescript rules which require parser services
      // https://github.com/eslint/eslint-plugin-markdown/tree/main/examples/typescript#typescript-example
      // https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TYPED_LINTING.md
      // https://github.com/typescript-eslint/typescript-eslint/issues/2373

      // Supported Rules (https://typescript-eslint.io/rules/#supported-rules) (filter by "requires type information")
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-for-in-array': 'off',
      '@typescript-eslint/no-meaningless-void-operator': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-qualifier': 'off',
      '@typescript-eslint/no-unnecessary-type-arguments': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/prefer-includes': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-reduce-type-parameter': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      '@typescript-eslint/prefer-return-this-type': 'off',
      '@typescript-eslint/prefer-string-starts-ends-with': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/require-array-sort-compare': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/unbound-method': 'off',
      // Extension Rules (https://typescript-eslint.io/rules/#extension-rules) (filter by "requires type information")
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/return-await': 'off',
    },
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
