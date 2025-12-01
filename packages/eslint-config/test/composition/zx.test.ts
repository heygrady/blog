import { describe, test, expect } from 'vitest'

import node from '../../node.js'
import zx from '../../zx.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getSettingsForFile,
} from '../utils/index.js'

describe('zx composition', () => {
  describe('extends node config', () => {
    test('includes all plugins from node config', async () => {
      const nodePlugins = await getPluginsForFile(node, 'src/script.mjs')
      const zxPlugins = await getPluginsForFile(zx, 'src/script.mjs')

      for (const plugin of Object.keys(nodePlugins)) {
        expect(Object.keys(zxPlugins)).toContain(plugin)
      }
    })

    test('includes vitest plugin for test files', async () => {
      const plugins = await getPluginsForFile(zx, 'src/script.test.mjs')
      expect(Object.keys(plugins)).toContain('vitest')
    })
  })

  describe('zx-specific globals', () => {
    test('adds $ global for command execution', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('$')
    })

    test('adds cd global for directory changes', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('cd')
    })

    test('adds chalk global for colored output', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('chalk')
    })

    test('adds fs global for file system operations', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('fs')
    })

    test('adds path global', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('path')
    })

    test('adds glob global for file matching', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('glob')
    })

    test('adds question global for user input', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('question')
    })

    test('adds sleep global for delays', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('sleep')
    })

    test('adds echo global for output', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('echo')
    })

    test('adds argv global for command line arguments', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('argv')
    })

    test('adds os global', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('os')
    })

    test('adds which global for finding executables', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('which')
    })

    test('adds YAML global for YAML parsing', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals).toHaveProperty('YAML')
    })

    test('globals are readonly', async () => {
      const langOptions = await getLanguageOptionsForFile(zx, 'src/script.mjs')
      expect(langOptions.globals?.['$']).toBe('readonly')
      expect(langOptions.globals?.['cd']).toBe('readonly')
      expect(langOptions.globals?.['chalk']).toBe('readonly')
    })
  })

  describe('zx-specific rules', () => {
    test('allows zx as importable module', async () => {
      const rules = await getRulesForFile(zx, 'src/script.mjs')
      const ruleConfig = rules['n/no-missing-import'] as unknown[]

      // Should have allowModules: ['zx']
      expect(Array.isArray(ruleConfig)).toBe(true)
      const options = ruleConfig?.[1] as { allowModules?: string[] }
      expect(options?.allowModules).toContain('zx')
    })
  })

  describe('zx-specific settings', () => {
    test('has zx-related settings', async () => {
      const settings = await getSettingsForFile(zx, 'src/script.mjs')
      // Check that settings exist (zx settings configure n/no-missing-import)
      expect(settings).toBeDefined()
    })
  })

  describe('still has Node.js behavior', () => {
    const config = zx

    test('has Node.js globals', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/script.mjs'
      )
      expect(langOptions.globals).toHaveProperty('process')
      expect(langOptions.globals).toHaveProperty('__dirname')
    })

    test('has prettier plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/script.mjs')
      expect(Object.keys(plugins)).toContain('prettier')
    })

    test('handles markdown files', async () => {
      const plugins = await getPluginsForFile(config, 'README.md')
      expect(Object.keys(plugins)).toContain('markdown')
    })
  })
})
