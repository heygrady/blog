import prettierConfigStandard from './load-prettier-config.cjs'

export default {
  ...prettierConfigStandard,
  trailingComma: 'es5',
}
