import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const prettierConfigStandard = require('prettier-config-standard')

export default {
  ...prettierConfigStandard,
  trailingComma: 'es5',
}
