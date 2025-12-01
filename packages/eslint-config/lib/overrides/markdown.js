import markdown from '@eslint/markdown'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

import { parserServicesRules } from '../parserServicesRules.js'

// common md overrides for all configs
export default [
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    processor: 'markdown/markdown',
    rules: {
      ...markdown.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.md/**'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
  {
    files: ['**/*.md/*.astro', '**/*.md/*.js', '**/*.md/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
    rules: {
      // Downgrade to warnings for docs - examples may have incomplete code
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'import/named': 'warn',
      'import/no-unresolved': 'warn',
      'n/no-missing-import': 'warn',
      // Markdown examples may import packages not in package.json
      'n/no-extraneous-import': 'off',
      // Browser examples in markdown may use APIs not available in Node
      'n/no-unsupported-features/node-builtins': 'warn',
    },
  },
  {
    files: ['**/*.md/*.ts', '**/*.md/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
        project: null,
      },
    },
    rules: {
      ...parserServicesRules,
      // Downgrade to warnings for docs - examples may have incomplete code
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/named': 'warn',
      'import/no-unresolved': 'warn',
      'n/no-missing-import': 'warn',
      // Markdown examples may import packages not in package.json
      'n/no-extraneous-import': 'off',
      // Browser examples in markdown may use APIs not available in Node
      'n/no-unsupported-features/node-builtins': 'warn',
    },
  },
  // https://github.com/eslint/eslint-plugin-markdown/blob/main/examples/react/.eslintrc.js
  {
    files: ['**/*.md/*.jsx', '**/*.md/*.tsx'],
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      'react/jsx-no-undef': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  // ES modules for JS code blocks in Markdown files (default)
  {
    files: ['**/*.md/*.js', '**/*.md/*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      'n/no-extraneous-import': 'off',
      // CJS examples in markdown often use ```js tag
      'n/no-missing-require': 'warn',
    },
  },
  // Override for CommonJS code blocks in Markdown files
  {
    files: ['**/*.md/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      'n/no-extraneous-require': 'off',
      'n/no-missing-require': 'warn',
    },
  },
]
