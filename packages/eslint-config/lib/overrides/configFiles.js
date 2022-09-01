// common config overrides for all configs
module.exports = [
  {
    files: ['*.config.{js,cjs,mjs}', '*rc.{js,cjs,mjs}'],
    rules: {
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-unresolved': 'warn',
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
    },
  },
]
