require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@heygrady/eslint-config/ts-node-esm'],
  // plugins: ['astro'],
  overrides: [
    ...require('./lib/overrides/src.js'),
    ...require('./lib/overrides/astroConfig.js'),
    // ...require('./lib/overrides/astro.js'),
  ],
}
