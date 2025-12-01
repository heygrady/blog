import nodeBase from '../lib/configs/node-base.js'
import typescript from '../lib/configs/typescript.js'
import jestOverrides from '../lib/overrides/jest.js'

export default [...nodeBase, ...typescript, ...jestOverrides]
