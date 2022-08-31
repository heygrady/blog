module.exports = [
  {
    files: ['**/*.{spec,test}.{cjs,mjs,js,jsx,cts,mts,ts,tsx}'],
    extends: ['plugin:jest-dom/recommended', 'plugin:testing-library/react'],
    rules: {
      // https://github.com/facebook/create-react-app/blob/f34d88e30c7d8be7181f728d1abc4fd8d5cd07d3/packages/eslint-config-react-app/jest.js#L40-L58
      'testing-library/await-async-query': 'error',
      'testing-library/await-async-utils': 'error',
      'testing-library/no-await-sync-query': 'error',
      'testing-library/no-container': 'error',
      'testing-library/no-debugging-utils': 'error',
      'testing-library/no-dom-import': ['error', 'react'],
      'testing-library/no-node-access': 'error',
      'testing-library/no-promise-in-fire-event': 'error',
      'testing-library/no-render-in-setup': 'error',
      'testing-library/no-unnecessary-act': 'error',
      'testing-library/no-wait-for-empty-callback': 'error',
      'testing-library/no-wait-for-multiple-assertions': 'error',
      'testing-library/no-wait-for-side-effects': 'error',
      'testing-library/no-wait-for-snapshot': 'error',
      'testing-library/prefer-find-by': 'error',
      'testing-library/prefer-presence-queries': 'error',
      'testing-library/prefer-query-by-disappearance': 'error',
      'testing-library/prefer-screen-queries': 'error',
      'testing-library/render-result-naming-convention': 'error',
    },
  },
]
