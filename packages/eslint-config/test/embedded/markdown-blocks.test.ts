import { describe, test, expect } from 'vitest'

import tsNodeEsm from '../../ts-node-esm.js'
import {
  getParserOptionsForFile,
  getRulesForFile,
  getPluginsForFile,
  normalizeSeverity,
  getConfigSummary,
} from '../utils/index.js'

describe('markdown code blocks', () => {
  const config = tsNodeEsm

  describe('markdown file config', () => {
    test('applies markdown plugin to .md files', async () => {
      const plugins = await getPluginsForFile(config, 'README.md')
      expect(Object.keys(plugins)).toContain('markdown')
    })

    test('has markdown plugin available for .md files', async () => {
      // The markdown plugin is included but markdown-specific rules
      // are applied via the processor, not as explicit rules
      const plugins = await getPluginsForFile(config, 'README.md')
      expect(Object.keys(plugins)).toContain('markdown')
    })
  })

  describe('code blocks in markdown', () => {
    // ESLint flat config uses virtual filenames like "README.md/0.js" for code blocks

    test('disables n/no-extraneous-import in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.ts')
      expect(normalizeSeverity(rules['n/no-extraneous-import'])).toBe('off')
    })

    test('keeps n/no-extraneous-require enabled in code blocks (only import is disabled)', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.ts')
      // Note: only n/no-extraneous-import is disabled, not require
      // This is intentional - import is more common in modern code examples
      expect(normalizeSeverity(rules['n/no-extraneous-require'])).toBe('error')
    })

    test('relaxes no-undef to warning in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.ts')
      expect(normalizeSeverity(rules['no-undef'])).toBe('warn')
    })

    test('relaxes no-unused-vars to warning in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.ts')
      expect(normalizeSeverity(rules['no-unused-vars'])).toBe('warn')
    })

    test('relaxes import/no-unresolved to warning in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.ts')
      expect(normalizeSeverity(rules['import/no-unresolved'])).toBe('warn')
    })

    test('relaxes n/no-missing-import to warning in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.ts')
      expect(normalizeSeverity(rules['n/no-missing-import'])).toBe('warn')
    })

    test('disables type-aware rules in code blocks', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'README.md/0.ts'
      )
      // Type-aware linting should be disabled
      expect(parserOptions.project).toBeNull()
    })
  })

  describe('different code block languages', () => {
    test('handles TypeScript code blocks', async () => {
      const plugins = await getPluginsForFile(config, 'README.md/0.ts')
      expect(Object.keys(plugins)).toContain('@typescript-eslint')
    })

    test('handles JavaScript code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.js')
      expect(rules).toHaveProperty('no-unused-vars')
    })

    test('handles TSX code blocks', async () => {
      const plugins = await getPluginsForFile(config, 'README.md/0.tsx')
      expect(Object.keys(plugins)).toContain('@typescript-eslint')
    })
  })

  describe('snapshots for markdown code blocks', () => {
    test('snapshot for TypeScript code block config', async () => {
      const summary = await getConfigSummary(config, 'README.md/0.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')

      // Key relaxed rules
      const relaxedRules = {
        'no-undef': summary.rules['no-undef'],
        'no-unused-vars': summary.rules['no-unused-vars'],
        'n/no-extraneous-import': summary.rules['n/no-extraneous-import'],
        'n/no-extraneous-require': summary.rules['n/no-extraneous-require'],
        'n/no-missing-import': summary.rules['n/no-missing-import'],
        'import/no-unresolved': summary.rules['import/no-unresolved'],
      }
      expect(relaxedRules).toMatchSnapshot('relaxed-rules')
    })
  })
})
