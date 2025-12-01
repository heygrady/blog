import { describe, test, expect } from 'vitest'

import nodeBase from '../../lib/configs/node-base.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getSettingsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('node-base config shape', () => {
  describe('structure', () => {
    test('exports an array of config objects', () => {
      expect(Array.isArray(nodeBase)).toBe(true)
      expect(nodeBase.length).toBeGreaterThan(0)
    })

    test('each config object has valid structure', () => {
      for (const config of nodeBase) {
        expect(typeof config).toBe('object')
        expect(config).not.toBeNull()
      }
    })
  })

  describe('plugins', () => {
    test('includes expected plugins for JS files', async () => {
      const plugins = await getPluginsForFile(nodeBase, 'src/index.js')
      const pluginNames = Object.keys(plugins)

      expect(pluginNames).toContain('eslint-comments')
      expect(pluginNames).toContain('n')
      expect(pluginNames).toContain('import')
      expect(pluginNames).toContain('jsdoc')
      expect(pluginNames).toContain('markdown')
      expect(pluginNames).toContain('json')
      expect(pluginNames).toContain('prettier')
    })

    test('does NOT include TypeScript plugin', async () => {
      const plugins = await getPluginsForFile(nodeBase, 'src/index.js')
      expect(Object.keys(plugins)).not.toContain('@typescript-eslint')
    })
  })

  describe('language options', () => {
    test('sets ecmaVersion to 2022', async () => {
      const langOptions = await getLanguageOptionsForFile(
        nodeBase,
        'src/index.js'
      )
      expect(langOptions.ecmaVersion).toBe(2022)
    })

    test('sets sourceType to module', async () => {
      const langOptions = await getLanguageOptionsForFile(
        nodeBase,
        'src/index.js'
      )
      expect(langOptions.sourceType).toBe('module')
    })

    test('includes node globals', async () => {
      const langOptions = await getLanguageOptionsForFile(
        nodeBase,
        'src/index.js'
      )
      expect(langOptions.globals).toBeDefined()
      // Check for a few common node globals
      expect(langOptions.globals).toHaveProperty('process')
      expect(langOptions.globals).toHaveProperty('__dirname')
    })

    test('includes ES2021 globals', async () => {
      const langOptions = await getLanguageOptionsForFile(
        nodeBase,
        'src/index.js'
      )
      expect(langOptions.globals).toBeDefined()
      // Check for ES globals
      expect(langOptions.globals).toHaveProperty('Promise')
    })

    test('sets sourceType to commonjs for .cjs files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        nodeBase,
        'lib/index.cjs'
      )
      expect(langOptions.sourceType).toBe('commonjs')
    })
  })

  describe('settings', () => {
    test('configures import resolver', async () => {
      const settings = await getSettingsForFile(nodeBase, 'src/index.js')
      expect(settings).toHaveProperty('import/resolver')
    })

    test('configures jsdoc mode as typescript', async () => {
      const settings = await getSettingsForFile(nodeBase, 'src/index.js')
      expect(settings).toHaveProperty('jsdoc')
      const jsdocSettings = (settings as Record<string, unknown>)[
        'jsdoc'
      ] as Record<string, unknown>
      expect(jsdocSettings?.['mode']).toBe('typescript')
    })

    test('configures node (n) typescriptExtensionMap', async () => {
      const settings = await getSettingsForFile(nodeBase, 'src/index.js')
      expect(settings).toHaveProperty('n')
      const nSettings = (settings as Record<string, unknown>)['n'] as Record<
        string,
        unknown
      >
      expect(nSettings?.['typescriptExtensionMap']).toBeDefined()
    })
  })

  describe('rules', () => {
    test('includes ESLint recommended rules', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      // Check for a few core ESLint rules
      expect(rules).toHaveProperty('no-unused-vars')
    })

    test('includes eslint-comments rules', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(rules).toHaveProperty('eslint-comments/no-unused-disable')
    })

    test('includes node plugin rules', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(rules).toHaveProperty('n/no-process-exit')
    })

    test('includes import plugin rules', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(rules).toHaveProperty('import/order')
    })

    test('includes jsdoc plugin rules', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(rules).toHaveProperty('jsdoc/require-jsdoc')
    })

    test('includes prettier rules', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(rules).toHaveProperty('prettier/prettier')
    })

    test('disables n/no-unpublished-import', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(normalizeSeverity(rules['n/no-unpublished-import'])).toBe('off')
    })

    test('disables n/no-unpublished-require', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(normalizeSeverity(rules['n/no-unpublished-require'])).toBe('off')
    })
  })

  describe('overrides', () => {
    describe('config files', () => {
      test('disables import/no-default-export for config files', async () => {
        const rules = await getRulesForFile(nodeBase, 'eslint.config.mjs')
        expect(normalizeSeverity(rules['import/no-default-export'])).toBe('off')
      })

      test('disables import/no-default-export for .config.js files', async () => {
        const rules = await getRulesForFile(nodeBase, 'vitest.config.js')
        expect(normalizeSeverity(rules['import/no-default-export'])).toBe('off')
      })
    })

    describe('JSON files', () => {
      test('applies json rules to .json files', async () => {
        const plugins = await getPluginsForFile(nodeBase, 'package.json')
        expect(Object.keys(plugins)).toContain('json')
      })
    })

    describe('markdown files', () => {
      test('applies markdown rules to .md files', async () => {
        const plugins = await getPluginsForFile(nodeBase, 'README.md')
        expect(Object.keys(plugins)).toContain('markdown')
      })
    })
  })
})
