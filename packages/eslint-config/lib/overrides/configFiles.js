// common config overrides for all configs
module.exports = [
  {
    files: ['*.config.{js,mjs}', '*rc.{js,mjs}'],
    rules: {
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
]
