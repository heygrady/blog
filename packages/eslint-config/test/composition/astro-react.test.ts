import { describe, test, expect } from 'vitest'

import astroReact from '../../astro-react.js'
import astroBase from '../../lib/configs/astro-base.js'
import reactBase from '../../lib/configs/react-base.js'
import testingLibraryOverrides from '../../lib/overrides/testingLibrary.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('astro-react composition', () => {
  describe('Step 1: astro-base (includes nodeBase + TypeScript + astro)', () => {
    const config = astroBase

    test('includes base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
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

    test('does NOT include react plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).not.toContain('react')
    })
  })

  describe('Step 2: astro-base + reactBase', () => {
    // astro-react uses reactBase (without jsx-a11y) since astro-base already includes it
    const config = [...astroBase, ...reactBase]

    test('adds react plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react')
    })

    test('adds react-hooks plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react-hooks')
    })

    test('has jsx-a11y from astro-base (not reactBase)', async () => {
      // astro-base includes jsx-a11y via astroPlugin.configs['flat/jsx-a11y-recommended']
      // reactBase does NOT include jsx-a11y (only the full react config does)
      // So the jsx-a11y plugin comes from astro-base
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('adds browser globals for JSX files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      expect(langOptions.globals).toHaveProperty('window')
      expect(langOptions.globals).toHaveProperty('document')
    })

    test('still has astro config for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })

    test('does NOT include testing-library yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('testing-library')
    })
  })

  describe('Step 3: + testingLibraryOverrides', () => {
    const config = [...astroBase, ...reactBase, ...testingLibraryOverrides]

    test('adds testing-library plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('adds jest-dom plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('jest-dom')
    })

    test('applies testing-library/react rules', async () => {
      const rules = await getRulesForFile(config, 'src/Component.test.tsx')
      expect(rules).toHaveProperty('testing-library/no-container')
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('Step 4: full astro-react (+ vitestOverrides)', () => {
    const config = astroReact

    test('includes all expected plugins for .tsx', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      const names = Object.keys(plugins)

      expect(names).toContain('react')
      expect(names).toContain('react-hooks')
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
    const config = astroReact

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

    test('has astro-prefixed jsx-a11y rules for .astro files', async () => {
      const rules = await getRulesForFile(config, 'src/Page.astro')
      expect(rules).toHaveProperty('astro/jsx-a11y/alt-text')
    })
  })

  describe('react-specific behavior', () => {
    const config = astroReact

    test('disables React-in-scope requirement (React 17+)', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(normalizeSeverity(rules['react/jsx-uses-react'])).toBe('off')
      expect(normalizeSeverity(rules['react/react-in-jsx-scope'])).toBe('off')
    })

    test('has react-hooks rules', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(rules).toHaveProperty('react-hooks/rules-of-hooks')
      expect(rules).toHaveProperty('react-hooks/exhaustive-deps')
    })
  })
})
