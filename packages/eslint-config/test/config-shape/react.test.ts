import { describe, test, expect } from 'vitest'

import jsxA11yConfig from '../../lib/configs/jsx-a11y.js'
import nodeBase from '../../lib/configs/node-base.js'
import reactBase from '../../lib/configs/react-base.js'
import typescript from '../../lib/configs/typescript.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getAllFilePatterns,
  normalizeSeverity,
} from '../utils/index.js'

describe('react-base config shape', () => {
  describe('structure (standalone)', () => {
    test('exports an array of config objects', () => {
      expect(Array.isArray(reactBase)).toBe(true)
      expect(reactBase.length).toBeGreaterThan(0)
    })

    test('has file patterns for JSX files', () => {
      const patterns = getAllFilePatterns(reactBase)
      expect(patterns.some((p) => p.includes('jsx') || p.includes('tsx'))).toBe(
        true
      )
    })
  })

  describe('jsx-a11y config', () => {
    test('exports an array of config objects', () => {
      expect(Array.isArray(jsxA11yConfig)).toBe(true)
    })

    test('has file patterns for JSX files', () => {
      const patterns = getAllFilePatterns(jsxA11yConfig)
      expect(patterns.some((p) => p.includes('jsx') || p.includes('tsx'))).toBe(
        true
      )
    })
  })

  describe('when composed with nodeBase + typescript + jsx-a11y', () => {
    const composedConfig = [
      ...nodeBase,
      ...typescript,
      ...reactBase,
      ...jsxA11yConfig,
    ]

    describe('plugins', () => {
      test('includes react plugin for .tsx files', async () => {
        const plugins = await getPluginsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(Object.keys(plugins)).toContain('react')
      })

      test('includes react-hooks plugin for .tsx files', async () => {
        const plugins = await getPluginsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(Object.keys(plugins)).toContain('react-hooks')
      })

      test('includes jsx-a11y plugin for .tsx files', async () => {
        const plugins = await getPluginsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(Object.keys(plugins)).toContain('jsx-a11y')
      })

      test('includes compat plugin for browser API checking', async () => {
        const plugins = await getPluginsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(Object.keys(plugins)).toContain('compat')
      })

      test('does NOT include react plugins for non-JSX files', async () => {
        const plugins = await getPluginsForFile(composedConfig, 'src/index.ts')
        expect(Object.keys(plugins)).not.toContain('react')
        expect(Object.keys(plugins)).not.toContain('react-hooks')
      })
    })

    describe('language options', () => {
      test('enables JSX parsing for .tsx files', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(langOptions.parserOptions?.ecmaFeatures?.jsx).toBe(true)
      })

      test('adds browser globals for .tsx files', async () => {
        const langOptions = await getLanguageOptionsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(langOptions.globals).toHaveProperty('window')
        expect(langOptions.globals).toHaveProperty('document')
        expect(langOptions.globals).toHaveProperty('navigator')
      })
    })

    describe('rules', () => {
      test('applies react recommended rules', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(rules).toHaveProperty('react/jsx-key')
      })

      test('applies react-hooks rules', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(rules).toHaveProperty('react-hooks/rules-of-hooks')
        expect(rules).toHaveProperty('react-hooks/exhaustive-deps')
      })

      test('applies jsx-a11y rules', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(rules).toHaveProperty('jsx-a11y/alt-text')
      })

      test('disables React-in-scope requirement (React 17+)', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(normalizeSeverity(rules['react/jsx-uses-react'])).toBe('off')
        expect(normalizeSeverity(rules['react/react-in-jsx-scope'])).toBe('off')
      })
    })
  })

  describe('reactBase without jsx-a11y', () => {
    const composedConfig = [...nodeBase, ...typescript, ...reactBase]

    test('does NOT include jsx-a11y plugin', async () => {
      const plugins = await getPluginsForFile(
        composedConfig,
        'src/Component.tsx'
      )
      expect(Object.keys(plugins)).not.toContain('jsx-a11y')
    })

    test('includes react plugin', async () => {
      const plugins = await getPluginsForFile(
        composedConfig,
        'src/Component.tsx'
      )
      expect(Object.keys(plugins)).toContain('react')
    })

    test('includes react-hooks plugin', async () => {
      const plugins = await getPluginsForFile(
        composedConfig,
        'src/Component.tsx'
      )
      expect(Object.keys(plugins)).toContain('react-hooks')
    })
  })
})
