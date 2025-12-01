import { describe, test, expect } from 'vitest'

import nodeBase from '../../lib/configs/node-base.js'
import node from '../../node.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('node composition', () => {
  describe('Step 1: nodeBase only', () => {
    const config = nodeBase

    test('provides base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.js')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
      expect(names).toContain('jsdoc')
    })

    test('has Node.js globals', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.js'
      )
      expect(langOptions.globals).toHaveProperty('process')
      expect(langOptions.globals).toHaveProperty('__dirname')
      expect(langOptions.globals).toHaveProperty('__filename')
    })

    test('has ESM globals', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.js'
      )
      expect(langOptions.globals).toHaveProperty('URL')
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.js')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })

    test('does NOT include TypeScript plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.js')
      expect(Object.keys(plugins)).not.toContain('@typescript-eslint')
    })
  })

  describe('Step 2: full node (+ vitestOverrides)', () => {
    const config = node

    test('includes vitest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.js')
      expect(Object.keys(plugins)).toContain('vitest')
    })

    test('applies vitest rules to test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.js')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('vitest/consistent-test-it prefers test over it', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.js')
      const ruleConfig = rules['vitest/consistent-test-it'] as unknown[]
      expect(Array.isArray(ruleConfig)).toBe(true)
      expect(ruleConfig?.[1]).toMatchObject({ fn: 'test' })
    })

    test('no-undef remains error in JS test files (only relaxed in markdown)', async () => {
      // Unlike TypeScript presets, the node preset doesn't relax no-undef in test files
      // because JavaScript test files don't have the same globals handling
      const rules = await getRulesForFile(config, 'src/index.test.js')
      expect(normalizeSeverity(rules['no-undef'])).toBe('error')
    })
  })

  describe('JavaScript only (no TypeScript)', () => {
    const config = node

    test('does NOT include TypeScript plugin for .js files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.js')
      expect(Object.keys(plugins)).not.toContain('@typescript-eslint')
    })

    test('uses default parser (not TypeScript parser)', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.js'
      )
      // The parser might be undefined or null for default espree
      // Or it could be espree explicitly
      const parser = langOptions.parser as
        | { meta?: { name?: string } }
        | undefined
      // If parser is set, it should not be TypeScript
      if (parser?.meta?.name) {
        expect(parser.meta.name).not.toBe('typescript-eslint/parser')
      }
    })
  })

  describe('markdown code blocks', () => {
    const config = node

    test('applies markdown plugin to .md files', async () => {
      const plugins = await getPluginsForFile(config, 'README.md')
      expect(Object.keys(plugins)).toContain('markdown')
    })

    test('disables n/no-extraneous-import in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.js')
      expect(normalizeSeverity(rules['n/no-extraneous-import'])).toBe('off')
    })

    test('relaxes no-undef in code blocks', async () => {
      const rules = await getRulesForFile(config, 'README.md/0.js')
      expect(normalizeSeverity(rules['no-undef'])).toBe('warn')
    })
  })

  describe('JSON files', () => {
    const config = node

    test('applies json plugin to .json files', async () => {
      const plugins = await getPluginsForFile(config, 'package.json')
      expect(Object.keys(plugins)).toContain('json')
    })
  })

  describe('config files', () => {
    const config = node

    test('handles eslint.config.mjs', async () => {
      const plugins = await getPluginsForFile(config, 'eslint.config.mjs')
      expect(Object.keys(plugins)).toContain('prettier')
    })
  })
})
