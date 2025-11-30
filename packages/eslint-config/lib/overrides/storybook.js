import storybook from 'eslint-plugin-storybook'

export default [
  // Use storybook's flat recommended config
  ...storybook.configs['flat/recommended'],
  // Additional overrides for story files
  {
    files: [
      '**/*.stories.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
      '**/*.story.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
    ],
    rules: {
      'import/default': 'off',
      'import/no-default-export': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
]
