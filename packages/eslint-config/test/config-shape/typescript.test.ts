import { describe, test, expect } from 'vitest'

import nodeBase from '../../lib/configs/node-base.js'
import typescript from '../../lib/configs/typescript.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  getAllFilePatterns,
  normalizeSeverity,
} from '../utils/index.js'

describe('typescript config shape', () => {
  describe('structure (standalone)', () => {
    test('exports an array of config objects', () => {
      expect(Array.isArray(typescript)).toBe(true)
      expect(typescript.length).toBeGreaterThan(0)
    })

    test('has file patterns for TypeScript files', () => {
      const patterns = getAllFilePatterns(typescript)
      // Check for patterns like **/*.{cts,mts,ts,tsx}
      expect(patterns.some((p) => p.includes('ts') || p.includes('{'))).toBe(
        true
      )
    })
  })

  // The typescript config is designed to be composed with nodeBase
  // Test it in the context it's actually used
  describe('composed with nodeBase', () => {
    const composedConfig = [...nodeBase, ...typescript]

    describe('TypeScript files (.ts)', () => {
      const filename = 'src/index.ts'

      test('includes @typescript-eslint plugin', async () => {
        const plugins = await getPluginsForFile(composedConfig, filename)
        expect(Object.keys(plugins)).toContain('@typescript-eslint')
      })

      test('uses TypeScript parser', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          filename
        )
        expect(langOptions.parser).toBeDefined()
        // Parser should be the TypeScript parser
        const parser = langOptions.parser as { meta?: { name?: string } }
        expect(parser.meta?.name).toBe('typescript-eslint/parser')
      })

      test('sets ecmaVersion to 2022', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          filename
        )
        expect(langOptions.parserOptions?.ecmaVersion).toBe(2022)
      })

      test('sets sourceType to module', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          filename
        )
        expect(langOptions.parserOptions?.sourceType).toBe('module')
      })

      test('includes TypeScript recommended rules', async () => {
        const rules = await getRulesForFile(composedConfig, filename)
        // Check for a few TypeScript rules
        expect(rules).toHaveProperty('@typescript-eslint/no-unused-vars')
      })

      test('disables explicit-function-return-type', async () => {
        const rules = await getRulesForFile(composedConfig, filename)
        expect(
          normalizeSeverity(
            rules['@typescript-eslint/explicit-function-return-type']
          )
        ).toBe('off')
      })

      test('disables triple-slash-reference', async () => {
        const rules = await getRulesForFile(composedConfig, filename)
        expect(
          normalizeSeverity(rules['@typescript-eslint/triple-slash-reference'])
        ).toBe('off')
      })

      test('still includes base plugins from nodeBase', async () => {
        const plugins = await getPluginsForFile(composedConfig, filename)
        const pluginNames = Object.keys(plugins)
        expect(pluginNames).toContain('prettier')
        expect(pluginNames).toContain('import')
        expect(pluginNames).toContain('n')
      })
    })

    describe('TypeScript extensions', () => {
      const extensions = ['.cts', '.mts', '.ts', '.tsx']

      for (const ext of extensions) {
        test(`applies TypeScript config to *${ext} files`, async () => {
          const filename = `src/index${ext}`
          const plugins = await getPluginsForFile(composedConfig, filename)
          expect(Object.keys(plugins)).toContain('@typescript-eslint')
        })
      }
    })

    describe('JavaScript files in src/', () => {
      // Note: The typescript override intentionally applies TypeScript parser
      // to JS files in src/ for better import resolution when JS imports TS

      test('applies TypeScript parser to .js files in src/ for better resolution', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          'src/index.js'
        )
        // JS files in src/ use TypeScript parser for better resolution
        const parser = langOptions.parser as { meta?: { name?: string } }
        expect(parser?.meta?.name).toBe('typescript-eslint/parser')
      })

      test('applies TypeScript parser to .mjs files in src/', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          'src/index.mjs'
        )
        const parser = langOptions.parser as { meta?: { name?: string } }
        expect(parser?.meta?.name).toBe('typescript-eslint/parser')
      })

      test('does NOT apply TypeScript plugin rules to .js files', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/index.js')
        // JS files should not have TypeScript-specific rules
        expect(rules['@typescript-eslint/no-unused-vars']).toBeUndefined()
      })
    })

    describe('type-aware overrides', () => {
      test('enables projectService for src files', async () => {
        const parserOptions = await getParserOptionsForFile(
          composedConfig,
          'src/index.ts'
        )
        expect(parserOptions.projectService).toBe(true)
      })

      test('disables type-aware linting for config files', async () => {
        // Config files should have project: null
        const parserOptions = await getParserOptionsForFile(
          composedConfig,
          'eslint.config.ts'
        )
        expect(parserOptions.project).toBeNull()
      })
    })
  })
})
