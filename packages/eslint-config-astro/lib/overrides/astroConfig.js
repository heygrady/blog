// common config overrides for all configs
module.exports = [
  {
    files: ['astro.config.{js,cjs,mjs}'],
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^@astrojs\\/'] }],
    },
  },
]
