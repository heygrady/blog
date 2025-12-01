import { describe, test, expect } from 'vitest'

import jsxA11yConfig from '../../lib/configs/jsx-a11y.js'
import nodeBase from '../../lib/configs/node-base.js'
import solidBase from '../../lib/configs/solid-base.js'
import typescript from '../../lib/configs/typescript.js'
import testingLibraryDomOverrides from '../../lib/overrides/testingLibraryDom.js'
import tsxSolidEsm from '../../tsx-solid-esm.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('tsx-solid-esm composition', () => {
  describe('Step 1: nodeBase + typescript', () => {
    const config = [...nodeBase, ...typescript]

    test('provides base plugins for TS files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('@typescript-eslint')
      expect(names).toContain('import')
    })

    test('does NOT include solid yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).not.toContain('solid')
    })
  })

  describe('Step 2: + solidBase + jsxA11y', () => {
    const config = [...nodeBase, ...typescript, ...solidBase, ...jsxA11yConfig]

    test('adds solid plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('solid')
    })

    test('adds jsx-a11y plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('adds browser globals for .tsx files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      expect(langOptions.globals).toHaveProperty('window')
      expect(langOptions.globals).toHaveProperty('document')
    })

    test('applies solid/reactivity rule', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(rules).toHaveProperty('solid/reactivity')
    })

    test('does NOT include testing-library yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('testing-library')
    })
  })

  describe('Step 3: + testingLibraryDomOverrides', () => {
    const config = [
      ...nodeBase,
      ...typescript,
      ...solidBase,
      ...jsxA11yConfig,
      ...testingLibraryDomOverrides,
    ]

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
      // DOM-specific rule that's different from react preset
      expect(rules).toHaveProperty('testing-library/no-node-access')
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('Step 4: full tsx-solid-esm (+ vitestOverrides)', () => {
    const config = tsxSolidEsm

    test('includes all expected plugins for .tsx', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      const names = Object.keys(plugins)

      expect(names).toContain('solid')
      expect(names).toContain('jsx-a11y')
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

  describe('solid-specific behavior', () => {
    const config = tsxSolidEsm

    test('has solid/reactivity rule', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(rules).toHaveProperty('solid/reactivity')
    })

    test('has solid/no-destructure rule', async () => {
      const rules = await getRulesForFile(config, 'src/Component.tsx')
      expect(rules).toHaveProperty('solid/no-destructure')
    })

    test('uses TypeScript parser for .tsx files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })

    test('includes compat plugin for browser API checking', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('compat')
    })
  })
})
