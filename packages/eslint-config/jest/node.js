import nodeBase from '../lib/configs/node-base.js'
import jestOverrides from '../lib/overrides/jest.js'
import markdownOverrides from '../lib/overrides/markdown.js'

export default [...nodeBase, ...jestOverrides, ...markdownOverrides]
