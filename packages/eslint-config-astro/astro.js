require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    '@heygrady/eslint-config/ts-node-esm',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
  ],
  rules: {
    ...require('./lib/rules/prettier.js'),
  },
  overrides: [
    ...require('./lib/overrides/src.js'),
    ...require('./lib/overrides/astroConfig.js'),
    ...require('./lib/overrides/astro.js'),
  ],
}
