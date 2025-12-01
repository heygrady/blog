import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

import { allExtensions, typescriptExtensions } from '../commonExtensions.js'
import { parserServicesRules } from '../parserServicesRules.js'
import prettierRules from '../rules/prettier.js'

// Common TypeScript settings for import resolver
const tsImportSettings = {
  'import/extensions': allExtensions,
  'import/parsers': {
    '@typescript-eslint/parser': typescriptExtensions,
  },
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      extensions: typescriptExtensions,
    },
    node: {
      extensions: allExtensions,
    },
  },
}

// Common TypeScript settings with project paths for import resolver
const tsImportSettingsWithProject = {
  ...tsImportSettings,
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      extensions: typescriptExtensions,
      project: [
        'apps/*/tsconfig.json',
        'packages/*/tsconfig.json',
        'scripts/*/tsconfig.json',
        'templates/*/tsconfig.json',
      ],
    },
    node: {
      extensions: allExtensions,
    },
  },
}

// Common TypeScript rules
const commonTsRules = {
  ...prettierRules,
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/triple-slash-reference': 'off',
  // Allow underscore-prefixed variables to be unused (common pattern for ignored params)
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  // Relax to warning - explicit any is sometimes intentional for truly dynamic types
  '@typescript-eslint/no-explicit-any': 'warn',
  'import/extensions': 'off',
  'n/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
}

export default [
  // TypeScript files without type-aware linting (outside src/)
  {
    files: ['**/*.{cts,mts,ts,tsx}', '**/*.d.{cts,mts,ts}'],
    ignores: ['src/**/*', '**/*.md/*'],
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: null,
      },
    },
    settings: tsImportSettings,
    rules: {
      ...tseslint.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...parserServicesRules,
      ...commonTsRules,
    },
  },

  // TypeScript files with type-aware linting (inside src/)
  {
    files: ['src/**/*.{cts,mts,ts,tsx}'],
    ignores: ['**/*.md/*'],
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: tsImportSettingsWithProject,
    rules: {
      ...tseslint.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...commonTsRules,
    },
  },

  // JavaScript files inside src/ (can use TypeScript parser for better resolution)
  {
    files: ['src/**/*.{js,jsx,cjs,mjs}'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: tsImportSettingsWithProject,
    rules: {
      ...prettierRules,
      'import/extensions': 'off',
      // n/no-missing-import doesn't support JS files importing TS files with .js extensions
      // Rely on import/no-unresolved with eslint-import-resolver-typescript instead
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
    },
  },

  // Code blocks within markdown files in src/ - disable type-aware rules
  {
    files: ['**/src/**/*.md/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      ...parserServicesRules,
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'import/named': 'off',
      'import/no-unresolved': 'off',
    },
  },
]
