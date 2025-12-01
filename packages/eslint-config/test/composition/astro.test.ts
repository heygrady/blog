import { describe, test, expect } from 'vitest'

import astro from '../../astro.js'
import astroBase from '../../lib/configs/astro-base.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('astro composition', () => {
  describe('Step 1: astro-base', () => {
    const config = astroBase

    test('includes base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
      expect(names).toContain('@typescript-eslint')
    })

    test('includes astro plugin for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })

    test('uses astro parser for .astro files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Page.astro'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('astro-eslint-parser')
    })

    test('disables prettier for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['prettier/prettier'])).toBe('off')
    })

    test('disables n/no-missing-import for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['n/no-missing-import'])).toBe('off')
    })

    test('has astro-prefixed jsx-a11y rules', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(rules).toHaveProperty('astro/jsx-a11y/alt-text')
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('Step 2: full astro (+ vitestOverrides)', () => {
    const config = astro

    test('includes vitest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).toContain('vitest')
    })

    test('applies vitest rules to test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.ts')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('disables type-aware linting for test files', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'src/index.test.ts'
      )
      expect(parserOptions.project).toBeNull()
    })

    test('relaxes @typescript-eslint/no-explicit-any in test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.ts')
      expect(
        normalizeSeverity(rules['@typescript-eslint/no-explicit-any'])
      ).toBe('off')
    })

    test('still has astro config for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })
  })

  describe('astro script blocks', () => {
    const config = astro

    test('applies TypeScript to astro script blocks', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro/0.ts')
      expect(Object.keys(plugins)).toContain('@typescript-eslint')
    })

    test('uses TypeScript parser for astro script blocks', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Page.astro/0.ts'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })

    test('disables n/no-missing-import in astro script blocks', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro/0.ts')
      expect(normalizeSeverity(rules['n/no-missing-import'])).toBe('off')
    })
  })

  describe('markdown code blocks in astro projects', () => {
    const config = astro

    test('disables type-aware linting for md code blocks', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'src/docs/README.md/0.ts'
      )
      expect(parserOptions.project).toBeNull()
    })
  })

  describe('no UI framework', () => {
    const config = astro

    test('does NOT include react plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).not.toContain('react')
    })

    test('does NOT include solid plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).not.toContain('solid')
    })

    test('does NOT include testing-library plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('testing-library')
    })
  })
})
