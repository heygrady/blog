import js from '@eslint/js'
import markdown from '@eslint/markdown'
import prettierConfig from 'eslint-config-prettier'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import json from 'eslint-plugin-json'
import n from 'eslint-plugin-n'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

import configFilesOverrides from '../overrides/configFiles.js'
import jsonOverrides from '../overrides/json.js'
import commonRules from '../rules/common.js'
import importRules from '../rules/import.js'
import jsdocRules from '../rules/jsdoc.js'
import nodeRules from '../rules/node.js'
import prettierRules from '../rules/prettier.js'
import importSettings from '../settings/import.js'
import jsdocSettings from '../settings/jsdoc.js'
import nodeSettings from '../settings/node.js'

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
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    settings: {
      ...nodeSettings,
      ...importSettings,
      ...jsdocSettings,
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

  // Prettier config (must be last among main configs)
  prettierConfig,

  // Overrides
  ...configFilesOverrides,
  ...jsonOverrides,

  // CJS files
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
]
