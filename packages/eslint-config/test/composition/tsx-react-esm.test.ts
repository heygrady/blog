import { describe, test, expect } from 'vitest'

import jsxA11yConfig from '../../lib/configs/jsx-a11y.js'
import nodeBase from '../../lib/configs/node-base.js'
import reactBase from '../../lib/configs/react-base.js'
import typescript from '../../lib/configs/typescript.js'
import testingLibraryOverrides from '../../lib/overrides/testingLibrary.js'
import tsxReactEsm from '../../tsx-react-esm.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('tsx-react-esm composition', () => {
  describe('Step 1: nodeBase + typescript', () => {
    const config = [...nodeBase, ...typescript]

    test('provides base plugins for TS files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('@typescript-eslint')
      expect(names).toContain('import')
    })

    test('does NOT include react yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).not.toContain('react')
    })
  })

  describe('Step 2: + reactBase + jsxA11y', () => {
    const config = [...nodeBase, ...typescript, ...reactBase, ...jsxA11yConfig]

    test('adds react plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react')
    })

    test('adds react-hooks plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react-hooks')
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

    test('does NOT include testing-library yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('testing-library')
    })
  })

  describe('Step 3: + testingLibraryOverrides', () => {
    const config = [
      ...nodeBase,
      ...typescript,
      ...reactBase,
      ...jsxA11yConfig,
      ...testingLibraryOverrides,
    ]

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
      // Check for react-specific testing-library rules
      expect(rules).toHaveProperty('testing-library/no-container')
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('Step 4: full tsx-react-esm (+ vitestOverrides)', () => {
    const config = tsxReactEsm

    test('includes all expected plugins for .tsx', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      const names = Object.keys(plugins)

      expect(names).toContain('react')
      expect(names).toContain('react-hooks')
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

  describe('react-specific behavior', () => {
    const config = tsxReactEsm

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

    test('uses TypeScript parser for .tsx files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Component.tsx'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })
  })
})
