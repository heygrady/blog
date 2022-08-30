// common import rules for all configs
module.exports = {
  'import/no-default-export': 'warn',
  'import/order': [
    'error',
    {
      alphabetize: { order: 'asc', caseInsensitive: true },
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'unknown'],
        'sibling',
        'index',
      ],
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: '..',
          group: 'parent',
        },
        {
          pattern: '.',
          group: 'sibling',
        },
        {
          pattern: '{**,.,..}/*.{css,less,scss,gif,jpg,png,svg}',
          group: 'index',
          position: 'after',
        },
      ],
    },
  ],
}
