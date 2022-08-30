require('@rushstack/eslint-patch/modern-module-resolution')

// zx globals
// https://github.com/google/zx/blob/main/src/globals.ts
const zxGlobals = [
  'ProcessPromise',
  'ProcessOutput',
  'log',
  '$',
  'argv',
  'cd',
  'chalk',
  'echo',
  'fs',
  'glob',
  'globby',
  'nothrow',
  'os',
  'path',
  'question',
  'quiet',
  'sleep',
  'stdin',
  'which',
  'within',
  'YAML',
].reduce((obj, key) => {
  obj[key] = 'readonly'
  return obj
}, {})

module.exports = {
  extends: [require.resolve('./node')],
  globals: {
    ...zxGlobals,
  },
  settings: {
    'import/core-modules': ['zx/globals'],
  },
  rules: {
    'n/no-missing-import': ['error', { allowModules: ['zx'] }],
  },
}
