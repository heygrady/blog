import js from '@eslint/js'
import markdown from '@eslint/markdown'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import compat from 'eslint-plugin-compat'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import n from 'eslint-plugin-n'

import { allExtensions } from './lib/commonExtensions.js'
import configFilesOverrides from './lib/overrides/configFiles.js'
import jsonOverrides from './lib/overrides/json.js'
import markdownOverrides from './lib/overrides/markdown.js'
import typescriptOverrides from './lib/overrides/typescript.js'
import vitestOverrides from './lib/overrides/vitest.js'
import commonRules from './lib/rules/common.js'
import importRules from './lib/rules/import.js'
import jsdocRules from './lib/rules/jsdoc.js'
import nodeRules from './lib/rules/node.js'
import prettierRules from './lib/rules/prettier.js'

export default [
  {
    ...js.configs.recommended,
    plugins: {
      'eslint-comments': eslintComments,
      compat,
      n,
      import: importPlugin,
      jsdoc,
      markdown,
      ts,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        es2021: true,
        node: true,
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: allExtensions,
        },
      },
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: {
      ...commonRules,
      ...importRules,
      ...jsdocRules,
      ...nodeRules,
      ...prettierRules,
    },
  },
  ...typescriptOverrides,
  ...configFilesOverrides,
  ...jsonOverrides,
  ...markdownOverrides,
  ...vitestOverrides,
  prettierConfig,
]
