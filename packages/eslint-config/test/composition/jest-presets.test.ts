import { describe, test, expect } from 'vitest'

import jestAstroReact from '../../jest/astro-react.js'
import jestAstroSolid from '../../jest/astro-solid.js'
import jestAstro from '../../jest/astro.js'
import jestNode from '../../jest/node.js'
import jestTsNodeEsm from '../../jest/ts-node-esm.js'
import jestTsxReactEsm from '../../jest/tsx-react-esm.js'
import jestTsxSolidEsm from '../../jest/tsx-solid-esm.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
} from '../utils/index.js'

describe('jest/* presets', () => {
  describe('jest/node', () => {
    const config = jestNode

    test('includes base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.js')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.js')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.js')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })

    test('applies jest rules to test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.js')
      expect(rules).toHaveProperty('jest/consistent-test-it')
    })

    test('jest/consistent-test-it prefers test over it', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.js')
      const ruleConfig = rules['jest/consistent-test-it'] as unknown[]
      expect(Array.isArray(ruleConfig)).toBe(true)
      expect(ruleConfig?.[1]).toMatchObject({ fn: 'test' })
    })

    test('adds jest globals to test files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.test.js'
      )
      expect(langOptions.globals).toHaveProperty('jest')
      expect(langOptions.globals).toHaveProperty('describe')
      expect(langOptions.globals).toHaveProperty('test')
      expect(langOptions.globals).toHaveProperty('expect')
    })
  })

  describe('jest/ts-node-esm', () => {
    const config = jestTsNodeEsm

    test('includes TypeScript plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      expect(Object.keys(plugins)).toContain('@typescript-eslint')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })

    test('applies jest rules to test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.ts')
      expect(rules).toHaveProperty('jest/consistent-test-it')
    })

    test('uses TypeScript parser', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.ts'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })
  })

  describe('jest/tsx-react-esm', () => {
    const config = jestTsxReactEsm

    test('includes react plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react')
    })

    test('includes react-hooks plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react-hooks')
    })

    test('includes jsx-a11y plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('includes testing-library plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('jest/tsx-solid-esm', () => {
    const config = jestTsxSolidEsm

    test('includes solid plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('solid')
    })

    test('includes jsx-a11y plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('includes testing-library plugin for test files (DOM version)', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('jest/astro', () => {
    const config = jestAstro

    test('includes astro plugin for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })

    test('uses astro parser for .astro files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/Page.astro'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('astro-eslint-parser')
    })
  })

  describe('jest/astro-react', () => {
    const config = jestAstroReact

    test('includes astro plugin for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })

    test('includes react plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react')
    })

    test('includes react-hooks plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('react-hooks')
    })

    test('includes jsx-a11y from astro-base for .tsx files', async () => {
      // jsx-a11y comes from astro-base, not reactBase
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('includes testing-library plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('jest/astro-solid', () => {
    const config = jestAstroSolid

    test('includes astro plugin for .astro files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Page.astro')
      expect(Object.keys(plugins)).toContain('astro')
    })

    test('includes solid plugin for .tsx files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('solid')
    })

    test('includes jsx-a11y from astro-base for .tsx files', async () => {
      // jsx-a11y comes from astro-base, not solidBase
      const plugins = await getPluginsForFile(config, 'src/Component.tsx')
      expect(Object.keys(plugins)).toContain('jsx-a11y')
    })

    test('includes jest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('jest')
    })

    test('includes testing-library plugin for test files (DOM version)', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).toContain('testing-library')
    })

    test('does NOT include vitest plugin', async () => {
      const plugins = await getPluginsForFile(config, 'src/Component.test.tsx')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('jest vs vitest comparison', () => {
    test('jest presets use jest plugin, vitest presets use vitest plugin', async () => {
      // Jest preset
      const jestPlugins = await getPluginsForFile(
        jestTsNodeEsm,
        'src/index.test.ts'
      )
      expect(Object.keys(jestPlugins)).toContain('jest')
      expect(Object.keys(jestPlugins)).not.toContain('vitest')

      // Import vitest preset for comparison
      const { default: tsNodeEsm } = await import('../../ts-node-esm.js')
      const vitestPlugins = await getPluginsForFile(
        tsNodeEsm,
        'src/index.test.ts'
      )
      expect(Object.keys(vitestPlugins)).toContain('vitest')
      expect(Object.keys(vitestPlugins)).not.toContain('jest')
    })

    test('both use consistent-test-it preferring test', async () => {
      const jestRules = await getRulesForFile(
        jestTsNodeEsm,
        'src/index.test.ts'
      )
      const jestConfig = jestRules['jest/consistent-test-it'] as unknown[]
      expect(Array.isArray(jestConfig)).toBe(true)
      expect(jestConfig?.[1]).toMatchObject({ fn: 'test' })

      const { default: tsNodeEsm } = await import('../../ts-node-esm.js')
      const vitestRules = await getRulesForFile(tsNodeEsm, 'src/index.test.ts')
      const vitestConfig = vitestRules['vitest/consistent-test-it'] as unknown[]
      expect(Array.isArray(vitestConfig)).toBe(true)
      expect(vitestConfig?.[1]).toMatchObject({ fn: 'test' })
    })
  })
})
