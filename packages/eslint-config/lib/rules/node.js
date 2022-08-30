// common node rules for all configs
module.exports = {
  'n/no-process-exit': 'warn',
  'n/no-unpublished-require': [
    'error',
    { allowModules: ['@rushstack/eslint-patch'] },
  ],
}
