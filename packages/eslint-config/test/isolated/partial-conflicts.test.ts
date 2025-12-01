import { describe, test, expect } from 'vitest'

import astroBase from '../../lib/configs/astro-base.js'
import jsxA11yConfig from '../../lib/configs/jsx-a11y.js'
import nodeBase from '../../lib/configs/node-base.js'
import reactBase from '../../lib/configs/react-base.js'
import solidBase from '../../lib/configs/solid-base.js'
import typescript from '../../lib/configs/typescript.js'
import configFilesOverrides from '../../lib/overrides/configFiles.js'
import jestOverrides from '../../lib/overrides/jest.js'
import jsonOverrides from '../../lib/overrides/json.js'
import markdownOverrides from '../../lib/overrides/markdown.js'
import testingLibraryOverrides from '../../lib/overrides/testingLibrary.js'
import testingLibraryDomOverrides from '../../lib/overrides/testingLibraryDom.js'
import typescriptOverrides from '../../lib/overrides/typescript.js'
import vitestOverrides from '../../lib/overrides/vitest.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('isolated partial config tests', () => {
  describe('partial configs are valid ESLint flat configs', () => {
    test('nodeBase is a valid array config', () => {
      expect(Array.isArray(nodeBase)).toBe(true)
      expect(nodeBase.length).toBeGreaterThan(0)
    })

    test('typescript is a valid array config', () => {
      expect(Array.isArray(typescript)).toBe(true)
      expect(typescript.length).toBeGreaterThan(0)
    })

    test('jsxA11yConfig is a valid array config', () => {
      expect(Array.isArray(jsxA11yConfig)).toBe(true)
      expect(jsxA11yConfig.length).toBeGreaterThan(0)
    })

    test('reactBase is a valid array config', () => {
      expect(Array.isArray(reactBase)).toBe(true)
      expect(reactBase.length).toBeGreaterThan(0)
    })

    test('solidBase is a valid array config', () => {
      expect(Array.isArray(solidBase)).toBe(true)
      expect(solidBase.length).toBeGreaterThan(0)
    })

    test('astroBase is a valid array config', () => {
      expect(Array.isArray(astroBase)).toBe(true)
      expect(astroBase.length).toBeGreaterThan(0)
    })
  })

  describe('overrides are valid ESLint flat configs', () => {
    test('vitestOverrides is a valid array config', () => {
      expect(Array.isArray(vitestOverrides)).toBe(true)
    })

    test('jestOverrides is a valid array config', () => {
      expect(Array.isArray(jestOverrides)).toBe(true)
    })

    test('markdownOverrides is a valid array config', () => {
      expect(Array.isArray(markdownOverrides)).toBe(true)
    })

    test('jsonOverrides is a valid array config', () => {
      expect(Array.isArray(jsonOverrides)).toBe(true)
    })

    test('configFilesOverrides is a valid array config', () => {
      expect(Array.isArray(configFilesOverrides)).toBe(true)
    })

    test('typescriptOverrides is a valid array config', () => {
      expect(Array.isArray(typescriptOverrides)).toBe(true)
    })

    test('testingLibraryOverrides is a valid array config', () => {
      expect(Array.isArray(testingLibraryOverrides)).toBe(true)
    })

    test('testingLibraryDomOverrides is a valid array config', () => {
      expect(Array.isArray(testingLibraryDomOverrides)).toBe(true)
    })
  })

  describe('vitest and jest overrides are mutually exclusive', () => {
    const vitestConfig = [...nodeBase, ...vitestOverrides]
    const jestConfig = [...nodeBase, ...jestOverrides]

    test('vitest config has vitest plugin, not jest', async () => {
      const plugins = await getPluginsForFile(vitestConfig, 'src/index.test.js')
      expect(Object.keys(plugins)).toContain('vitest')
      expect(Object.keys(plugins)).not.toContain('jest')
    })

    test('jest config has jest plugin, not vitest', async () => {
      const plugins = await getPluginsForFile(jestConfig, 'src/index.test.js')
      expect(Object.keys(plugins)).toContain('jest')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })

    test('both prefer test over it', async () => {
      const vitestRules = await getRulesForFile(
        vitestConfig,
        'src/index.test.js'
      )
      const jestRules = await getRulesForFile(jestConfig, 'src/index.test.js')

      const vitestRule = vitestRules['vitest/consistent-test-it'] as unknown[]
      expect(vitestRule?.[1]).toMatchObject({
        fn: 'test',
      })
      const jestRule = jestRules['jest/consistent-test-it'] as unknown[]
      expect(jestRule?.[1]).toMatchObject({
        fn: 'test',
      })
    })
  })

  describe('react and solid are alternatives (not composable)', () => {
    test('reactBase does NOT include solid plugin', async () => {
      const config = [...nodeBase, ...typescript, ...reactBase]
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react')
      expect(Object.keys(plugins)).not.toContain('solid')
    })

    test('solidBase does NOT include react plugin', async () => {
      const config = [...nodeBase, ...typescript, ...solidBase]
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('solid')
      expect(Object.keys(plugins)).not.toContain('react')
    })
  })

  describe('testing-library variants are alternatives', () => {
    // testingLibraryOverrides is for React
    // testingLibraryDomOverrides is for Solid/DOM

    test('both include testing-library and jest-dom plugins', async () => {
      const reactConfig = [
        ...nodeBase,
        ...typescript,
        ...reactBase,
        ...testingLibraryOverrides,
      ]
      const domConfig = [
        ...nodeBase,
        ...typescript,
        ...solidBase,
        ...testingLibraryDomOverrides,
      ]

      const reactPlugins = await getPluginsForFile(
        reactConfig,
        'src/Component.test.tsx'
      )
      const domPlugins = await getPluginsForFile(
        domConfig,
        'src/Component.test.tsx'
      )

      expect(Object.keys(reactPlugins)).toContain('testing-library')
      expect(Object.keys(reactPlugins)).toContain('jest-dom')

      expect(Object.keys(domPlugins)).toContain('testing-library')
      expect(Object.keys(domPlugins)).toContain('jest-dom')
    })
  })

  describe('jsx-a11y integration', () => {
    test('reactBase + jsxA11yConfig includes jsx-a11y', async () => {
      const config = [
        ...nodeBase,
        ...typescript,
        ...reactBase,
        ...jsxA11yConfig,
      ]
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('reactBase (without jsx-a11y) can be used with astro', async () => {
      // astro-base already includes jsx-a11y via the astro plugin
      // so reactBase should be used instead of full react
      const config = [...astroBase, ...reactBase]
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react')
      // jsx-a11y comes from astro-base
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('solidBase + jsxA11yConfig includes jsx-a11y', async () => {
      const config = [
        ...nodeBase,
        ...typescript,
        ...solidBase,
        ...jsxA11yConfig,
      ]
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('solidBase (without jsx-a11y) can be used with astro', async () => {
      const config = [...astroBase, ...solidBase]
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('solid')
      // jsx-a11y comes from astro-base
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })
  })

  describe('prettier rule consistency', () => {
    test('nodeBase enables prettier', async () => {
      const rules = await getRulesForFile(nodeBase, 'src/index.js')
      expect(normalizeSeverity(rules['prettier/prettier'])).toBe('error')
    })

    test('astro files disable prettier (handled by astro formatter)', async () => {
      const rules = await getRulesForFile(astroBase, 'src/Page.astro')
      expect(normalizeSeverity(rules['prettier/prettier'])).toBe('off')
    })
  })

  describe('TypeScript parser consistency', () => {
    test('typescript config uses TypeScript parser for .ts files', async () => {
      const config = [...nodeBase, ...typescript]
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.ts'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })

    test('typescript config also uses TypeScript parser for .js in src/', async () => {
      // This is intentional for better resolution of .js imports to .ts files
      const config = [...nodeBase, ...typescript]
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.js'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })

    test('astroBase uses astro parser for .astro files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        astroBase,
        'src/Page.astro'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('astro-eslint-parser')
    })
  })

  describe('file pattern coverage', () => {
    test('markdown overrides apply to .md files', async () => {
      const config = [...nodeBase, ...markdownOverrides]
      const plugins = await getPluginsForFile(config, 'README.md')
      expect(Object.keys(plugins)).toContain('markdown')
    })

    test('json overrides apply to .json files', async () => {
      const config = [...nodeBase, ...jsonOverrides]
      const plugins = await getPluginsForFile(config, 'package.json')
      expect(Object.keys(plugins)).toContain('json')
    })

    test('overrides apply to .test.ts files', async () => {
      const config = [...nodeBase, ...vitestOverrides]
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).toContain('vitest')
    })

    test('overrides apply to .spec.ts files', async () => {
      const config = [...nodeBase, ...vitestOverrides]
      const plugins = await getPluginsForFile(config, 'src/index.spec.ts')
      expect(Object.keys(plugins)).toContain('vitest')
    })
  })
})
