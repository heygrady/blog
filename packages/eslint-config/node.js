import js from '@eslint/js'
import markdown from '@eslint/markdown'
import prettierConfig from 'eslint-config-prettier'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import jsdoc from 'eslint-plugin-jsdoc'
import json from 'eslint-plugin-json'
import n from 'eslint-plugin-n'
import prettierPlugin from 'eslint-plugin-prettier'

import configFilesOverrides from './lib/overrides/configFiles.js'
import jestOverrides from './lib/overrides/jest.js'
import jsonOverrides from './lib/overrides/json.js'
import markdownOverrides from './lib/overrides/markdown.js'
import vitestOverrides from './lib/overrides/vitest.js'
import commonRules from './lib/rules/common.js'
import importRules from './lib/rules/import.js'
import jsdocRules from './lib/rules/jsdoc.js'
import nodeRules from './lib/rules/node.js'
import prettierRules from './lib/rules/prettier.js'

export default [
  // Main configuration
  {
    plugins: {
      'eslint-comments': eslintComments,
      n,
      import: importPlugin,
      jsdoc,
      markdown: markdown,
      json,
      jest,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        es2021: true,
        node: true,
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: {
          extensions: ['.cjs', '.mjs', '.js', 'jsx'], // from commonExtensions.js
        },
      },
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintComments.configs.recommended.rules,
      ...n.configs['flat/recommended'].rules,
      ...importPlugin.configs.recommended.rules,
      ...jsdoc.configs['flat/recommended'].rules,
      ...commonRules,
      ...importRules,
      ...jsdocRules,
      ...nodeRules,
      ...prettierRules,
    },
  },

  // Prettier config (must be last)
  prettierConfig,

  // Overrides
  ...configFilesOverrides,
  ...jestOverrides,
  ...jsonOverrides,
  ...markdownOverrides,
  ...vitestOverrides,

  // CJS files
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },

  // Override to allow importing @eslint/js
  {
    rules: {
      'n/no-extraneous-import': [
        'error',
        {
          allowModules: ['@eslint/js'],
        },
      ],
    },
  },
]
