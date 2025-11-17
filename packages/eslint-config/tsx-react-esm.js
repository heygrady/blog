import js from '@eslint/js'
import markdown from '@eslint/markdown'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import compat from 'eslint-plugin-compat'
import eslintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import n from 'eslint-plugin-n'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'

import { allExtensions } from './lib/commonExtensions.js'
import configFilesOverrides from './lib/overrides/configFiles.js'
import jestOverrides from './lib/overrides/jest.js'
import jsonOverrides from './lib/overrides/json.js'
import markdownOverrides from './lib/overrides/markdown.js'
import storybookOverrides from './lib/overrides/storybook.js'
import testingLibraryOverrides from './lib/overrides/testingLibrary.js'
import typescriptOverrides from './lib/overrides/typescript.js'
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
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      storybook,
      markdown,
      ts,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        browser: true,
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
      'n/no-unpublished-import': [
        'error',
        { allowModules: ['@testing-library/jest-dom'] },
      ],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  ...configFilesOverrides,
  ...jestOverrides,
  ...jsonOverrides,
  ...markdownOverrides,
  ...storybookOverrides,
  ...testingLibraryOverrides,
  ...typescriptOverrides,
  prettierConfig,
]
