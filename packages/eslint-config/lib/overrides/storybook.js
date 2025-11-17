export default [
  {
    files: [
      '*.stories.@(ts|tsx|mts|cts|js|jsx|mjs|cjs)',
      '*.story.@(ts|tsx|mts|cts|js|jsx|mjs|cjs)',
    ],
    rules: {
      'import/default': 'off',
      'import/no-default-export': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
]
