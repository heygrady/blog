import { describe, test, expect } from 'vitest'

import astroSolid from '../../astro-solid.js'
import {
  getParserOptionsForFile,
  getSettingsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getPluginsForFile,
  normalizeSeverity,
  getConfigSummary,
} from '../utils/index.js'

describe('astro script blocks', () => {
  const config = astroSolid

  describe('astro file config', () => {
    test('uses astro parser for .astro files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Page.astro'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('astro-eslint-parser')
    })

    test('includes astro plugin for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })

    test('disables prettier for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['prettier/prettier'])).toBe('off')
    })

    test('disables n/no-missing-import for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['n/no-missing-import'])).toBe('off')
    })

    test('includes astro-prefixed jsx-a11y rules', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(rules).toHaveProperty('astro/jsx-a11y/alt-text')
    })
  })

  describe('script blocks in astro files', () => {
    // Astro uses virtual filenames like "src/Page.astro/0.ts" for script blocks

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

  describe('astro virtual modules', () => {
    // Astro has virtual modules like astro:content, astro:assets

    test('ignores import/no-unresolved for astro virtual modules', async () => {
      // The astro overrides should configure import resolver to handle astro:* imports
      const settings = await getSettingsForFile(config, 'src/Page.astro')
      // The pattern is a regex: astro:.*
      expect(settings?.['import/ignore']).toContain('astro:.*')
    })
  })

  describe('markdown code blocks in src/ astro files', () => {
    // Code blocks in markdown within src/ directory

    test('disables type-aware linting for md code blocks in src/', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'src/docs/README.md/0.ts'
      )
      expect(parserOptions.project).toBeNull()
    })
  })

  describe('snapshots for astro files', () => {
    test('snapshot for astro file config', async () => {
      const summary = await getConfigSummary(config, 'src/Page.astro')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')

      // Key astro rules
      const astroRules = Object.fromEntries(
        Object.entries(summary.rules).filter(([k]) => k.startsWith('astro/'))
      )
      expect(Object.keys(astroRules).length).toBeGreaterThan(0)
    })

    test('snapshot for astro script block config', async () => {
      const summary = await getConfigSummary(config, 'src/Page.astro/0.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })
  })
})
