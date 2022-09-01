const {
  nodeExtensions,
  typescriptExtensions,
} = require('@heygrady/eslint-config/lib/commonExtensions')

const astroExtensions = ['.astro']

const allExtensions = [
  ...nodeExtensions,
  ...typescriptExtensions,
  // ...astroExtensions,
]

module.exports = {
  allExtensions,
  nodeExtensions,
  typescriptExtensions,
}
