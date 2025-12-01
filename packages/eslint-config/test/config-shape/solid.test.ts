import { describe, test, expect } from 'vitest'

import jsxA11yConfig from '../../lib/configs/jsx-a11y.js'
import nodeBase from '../../lib/configs/node-base.js'
import solidBase from '../../lib/configs/solid-base.js'
import typescript from '../../lib/configs/typescript.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getAllFilePatterns,
} from '../utils/index.js'

describe('solid-base config shape', () => {
  describe('structure (standalone)', () => {
    test('exports an array of config objects', () => {
      expect(Array.isArray(solidBase)).toBe(true)
      expect(solidBase.length).toBeGreaterThan(0)
    })

    test('has file patterns for JSX files', () => {
      const patterns = getAllFilePatterns(solidBase)
      expect(patterns.some((p) => p.includes('jsx') || p.includes('tsx'))).toBe(
        true
      )
    })
  })

  describe('when composed with nodeBase + typescript + jsx-a11y', () => {
    const composedConfig = [
      ...nodeBase,
      ...typescript,
      ...solidBase,
      ...jsxA11yConfig,
    ]

    describe('plugins', () => {
      test('includes solid plugin for .tsx files', async () => {
        const plugins = await getPluginsForFile(
          composedConfig,
          'src/Component.tsx'
        )
        expect(Object.keys(plugins)).toContain('solid')
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

      test('does NOT include solid plugins for non-JSX files', async () => {
        const plugins = await getPluginsForFile(composedConfig, 'src/index.ts')
        expect(Object.keys(plugins)).not.toContain('solid')
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
      test('applies solid/reactivity rule', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(rules).toHaveProperty('solid/reactivity')
      })

      test('applies solid/no-destructure rule', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(rules).toHaveProperty('solid/no-destructure')
      })

      test('applies jsx-a11y rules', async () => {
        const rules = await getRulesForFile(composedConfig, 'src/Component.tsx')
        expect(rules).toHaveProperty('jsx-a11y/alt-text')
      })
    })
  })

  describe('solidBase without jsx-a11y', () => {
    const composedConfig = [...nodeBase, ...typescript, ...solidBase]

    test('does NOT include jsx-a11y plugin', async () => {
      const plugins = await getPluginsForFile(
        composedConfig,
        'src/Component.tsx'
      )
      expect(Object.keys(plugins)).not.toContain('jsx-a11y')
    })

    test('includes solid plugin', async () => {
      const plugins = await getPluginsForFile(
        composedConfig,
        'src/Component.tsx'
      )
      expect(Object.keys(plugins)).toContain('solid')
    })
  })
})
