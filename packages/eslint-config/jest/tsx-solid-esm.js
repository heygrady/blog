import jsxA11y from '../lib/configs/jsx-a11y.js'
import nodeBase from '../lib/configs/node-base.js'
import solidBase from '../lib/configs/solid-base.js'
import typescript from '../lib/configs/typescript.js'
import jestOverrides from '../lib/overrides/jest.js'
import markdownOverrides from '../lib/overrides/markdown.js'
import testingLibraryDomOverrides from '../lib/overrides/testingLibraryDom.js'

export default [
  ...nodeBase,
  ...typescript,
  ...solidBase,
  ...jsxA11y,
  ...testingLibraryDomOverrides,
  ...jestOverrides,
  ...markdownOverrides,
]
