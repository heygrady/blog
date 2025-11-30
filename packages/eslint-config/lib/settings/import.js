// eslint-plugin-import resolver settings
import { allExtensions } from '../commonExtensions.js'

export default {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      extensions: allExtensions,
    },
    node: {
      extensions: allExtensions,
    },
  },
}
