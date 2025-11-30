import zxSettings from './lib/settings/zx.js'
import nodeConfig from './node.js'

// zx globals
// https://github.com/google/zx/blob/main/src/globals.ts
const zxGlobals = [
  'ProcessPromise',
  'ProcessOutput',
  '$',
  'argv',
  'cd',
  'chalk',
  'defaults',
  'dotenv',
  'echo',
  'expBackoff',
  'fs',
  'glob',
  'globby',
  'kill',
  'log',
  'minimist',
  'nothrow',
  'os',
  'parseArgv',
  'path',
  'ps',
  'question',
  'quiet',
  'quote',
  'quotePowerShell',
  'resolveDefaults',
  'retry',
  'sleep',
  'spinner',
  'stdin',
  'syncProcessCwd',
  'tempdir',
  'tempfile',
  'tmpdir',
  'tmpfile',
  'updateArgv',
  'useBash',
  'usePowerShell',
  'usePwsh',
  'version',
  'VERSION',
  'which',
  'within',
  'YAML',
].reduce((obj, key) => {
  obj[key] = 'readonly'
  return obj
}, {})

export default [
  ...nodeConfig,
  {
    languageOptions: {
      globals: {
        ...zxGlobals,
      },
    },
    settings: {
      ...zxSettings,
    },
    rules: {
      'n/no-missing-import': ['error', { allowModules: ['zx'] }],
    },
  },
]
