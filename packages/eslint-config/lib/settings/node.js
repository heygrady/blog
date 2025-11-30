// eslint-plugin-n settings for TypeScript resolution
import { allExtensions } from '../commonExtensions.js'

export default {
  n: {
    // Map TypeScript extensions to JavaScript output extensions
    // This allows .js imports to resolve to .ts files
    typescriptExtensionMap: [
      ['', '.js'],
      ['.ts', '.js'],
      ['.tsx', '.jsx'],
      ['.cts', '.cjs'],
      ['.mts', '.mjs'],
    ],
    // Try these extensions when resolving imports
    // .json for JSON modules, .node for native binary add-ons
    tryExtensions: [...allExtensions, '.json', '.node'],
  },
}
