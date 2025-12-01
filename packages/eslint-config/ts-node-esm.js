import nodeBase from './lib/configs/node-base.js'
import typescript from './lib/configs/typescript.js'
import vitestOverrides from './lib/overrides/vitest.js'

export default [...nodeBase, ...typescript, ...vitestOverrides]
