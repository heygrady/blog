import { describe, test, expect } from 'vitest'

import astroSolid from '../../astro-solid.js'
import astroBase from '../../lib/configs/astro-base.js'
import solidBase from '../../lib/configs/solid-base.js'
import testingLibraryDomOverrides from '../../lib/overrides/testingLibraryDom.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('astro-solid composition', () => {
  describe('Step 1: astro-base (includes nodeBase + TypeScript + astro)', () => {
    const config = astroBase

    test('includes base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
    })

    test('includes TypeScript plugin for .ts files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      expect(Object.keys(plugins)).toContain('@typescript-eslint')
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

    test('includes jsx-a11y rules from astro plugin', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      // Astro plugin prefixes jsx-a11y rules with astro/
      expect(rules).toHaveProperty('astro/jsx-a11y/alt-text')
    })

    test('disables prettier for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['prettier/prettier'])).toBe('off')
    })

    test('does NOT include solid plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).not.toContain('solid')
    })
  })

  describe('Step 2: astro-base + solidBase', () => {
    const config = [...astroBase, ...solidBase]

    test('adds solid plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('solid')
    })

    test('adds browser globals for JSX files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      expect(langOptions.globals).toHaveProperty('window')
      expect(langOptions.globals).toHaveProperty('document')
    })

    test('enables JSX parsing for .tsx files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      expect(langOptions.parserOptions?.ecmaFeatures?.jsx).toBe(true)
    })

    test('applies solid rules for .tsx files', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(rules).toHaveProperty('solid/reactivity')
    })

    test('does NOT include testing-library yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('testing-library')
    })

    test('still has astro config for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })
  })

  describe('Step 3: + testingLibraryDomOverrides', () => {
    const config = [...astroBase, ...solidBase, ...testingLibraryDomOverrides]

    test('adds testing-library plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('adds jest-dom plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('jest-dom')
    })

    test('applies testing-library/dom rules (not react)', async () => {
      const rules = await getRulesForFile(config, 'src/Component.test.tsx')
      // Check for a dom-specific rule
      expect(rules).toHaveProperty('testing-library/no-node-access')
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('Step 4: full astro-solid (+ vitestOverrides)', () => {
    const config = astroSolid

    test('includes all expected plugins for .tsx', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      const names = Object.keys(plugins)

      expect(names).toContain('solid')
      expect(names).toContain('@typescript-eslint')
      expect(names).toContain('prettier')
      expect(names).toContain('import')
    })

    test('includes vitest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('vitest')
    })

    test('includes testing-library plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('applies vitest rules to test files', async () => {
      const rules = await getRulesForFile(config, 'src/Component.test.tsx')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('disables type-aware linting for test files', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'src/Component.test.tsx'
      )
      expect(parserOptions.project).toBeNull()
    })

    test('relaxes @typescript-eslint/no-explicit-any in test files', async () => {
      const rules = await getRulesForFile(config, 'src/Component.test.tsx')
      expect(
        normalizeSeverity(rules['@typescript-eslint/no-explicit-any'])
      ).toBe('off')
    })
  })

  describe('astro-specific behavior', () => {
    const config = astroSolid

    test('uses astro parser for .astro files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Page.astro'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('astro-eslint-parser')
    })

    test('disables n/no-missing-import for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['n/no-missing-import'])).toBe('off')
    })

    test('disables prettier for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(normalizeSeverity(rules['prettier/prettier'])).toBe('off')
    })

    test('has jsx-a11y rules for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      // Astro plugin prefixes jsx-a11y rules with astro/
      expect(rules).toHaveProperty('astro/jsx-a11y/alt-text')
    })
  })

  describe('solid-specific behavior', () => {
    const config = astroSolid

    test('includes compat plugin for browser API checking', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('compat')
    })

    test('has browser globals for .tsx files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      expect(langOptions.globals).toHaveProperty('window')
      expect(langOptions.globals).toHaveProperty('document')
      expect(langOptions.globals).toHaveProperty('navigator')
    })

    test('applies solid/reactivity rule', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(rules).toHaveProperty('solid/reactivity')
    })
  })
})
