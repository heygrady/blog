const nodeExtensions = ['.cjs', '.mjs', '.js', 'jsx']
const typescriptExtensions = ['.cts', '.mts', '.ts', '.tsx']
const allExtensions = [...nodeExtensions, typescriptExtensions]

module.exports = {
  allExtensions,
  nodeExtensions,
  typescriptExtensions,
}
