import json from 'eslint-plugin-json'

export default [
  {
    files: ['**/*.json', '!package.json'],
    plugins: {
      json,
    },
    rules: {
      ...json.configs.recommended.rules,
    },
  },
]
