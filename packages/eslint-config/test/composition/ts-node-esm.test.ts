import { describe, test, expect } from 'vitest'

import nodeBase from '../../lib/configs/node-base.js'
import typescript from '../../lib/configs/typescript.js'
import vitestOverrides from '../../lib/overrides/vitest.js'
import tsNodeEsm from '../../ts-node-esm.js'
import {
  getPluginsForFile,
  getRulesForFile,
  getLanguageOptionsForFile,
  getParserOptionsForFile,
  normalizeSeverity,
} from '../utils/index.js'

describe('ts-node-esm composition', () => {
  describe('Step 1: nodeBase only', () => {
    const config = nodeBase

    test('provides base plugins for JS files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.js')
      const names = Object.keys(plugins)

      expect(names).toContain('eslint-comments')
      expect(names).toContain('n')
      expect(names).toContain('import')
      expect(names).toContain('jsdoc')
      expect(names).toContain('prettier')
    })

    test('does NOT include TypeScript plugin for JS files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.js')
      expect(Object.keys(plugins)).not.toContain('@typescript-eslint')
    })

    test('does NOT include vitest plugin for JS files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.js')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })

    test('has base ESLint rules', async () => {
      const rules = await getRulesForFile(config, 'src/index.js')
      expect(rules).toHaveProperty('no-unused-vars')
      expect(rules).toHaveProperty('import/order')
      expect(rules).toHaveProperty('prettier/prettier')
    })
  })

  describe('Step 2: nodeBase + typescript', () => {
    const config = [...nodeBase, ...typescript]

    test('still has base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
    })

    test('adds TypeScript plugin for .ts files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      expect(Object.keys(plugins)).toContain('@typescript-eslint')
    })

    test('uses TypeScript parser for .ts files', async () => {
      const langOptions = await getLanguageOptionsForFile(
        config,
        'src/index.ts'
      )
      const parser = langOptions.parser as { meta?: { name?: string } }
      expect(parser?.meta?.name).toBe('typescript-eslint/parser')
    })

    test('adds TypeScript rules for .ts files', async () => {
      const rules = await getRulesForFile(config, 'src/index.ts')
      expect(rules).toHaveProperty('@typescript-eslint/no-unused-vars')
      expect(
        normalizeSeverity(rules['@typescript-eslint/no-explicit-any'])
      ).toBe('warn')
    })

    test('disables n/no-missing-import for TypeScript', async () => {
      const rules = await getRulesForFile(config, 'src/index.ts')
      expect(normalizeSeverity(rules['n/no-missing-import'])).toBe('off')
    })

    test('enables type-aware linting for src/ files', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'src/index.ts'
      )
      expect(parserOptions.projectService).toBe(true)
    })

    test('disables type-aware linting for config files', async () => {
      const parserOptions = await getParserOptionsForFile(
        config,
        'vitest.config.ts'
      )
      expect(parserOptions.project).toBeNull()
    })

    test('does NOT include vitest plugin yet', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).not.toContain('vitest')
    })
  })

  describe('Step 3: full ts-node-esm (nodeBase + typescript + vitest)', () => {
    const config = tsNodeEsm

    test('includes all base plugins', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.ts')
      const names = Object.keys(plugins)

      expect(names).toContain('prettier')
      expect(names).toContain('import')
      expect(names).toContain('n')
      expect(names).toContain('@typescript-eslint')
    })

    test('includes vitest plugin for test files', async () => {
      const plugins = await getPluginsForFile(config, 'src/index.test.ts')
      expect(Object.keys(plugins)).toContain('vitest')
    })

    test('applies vitest rules to test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.ts')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('requires "test" over "it" in vitest', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.ts')
      const ruleConfig = rules['vitest/consistent-test-it'] as unknown[]
      expect(Array.isArray(ruleConfig)).toBe(true)
      expect(ruleConfig?.[1]).toMatchObject({ fn: 'test' })
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

    test('applies vitest to spec files too', async () => {
      const plugins = await getPluginsForFile(config, 'test/example.spec.ts')
      expect(Object.keys(plugins)).toContain('vitest')
    })

    test('does NOT apply vitest to non-test files', async () => {
      const rules = await getRulesForFile(config, 'src/index.ts')
      // Non-test files should not have vitest rules
      expect(rules['vitest/consistent-test-it']).toBeUndefined()
    })
  })

  describe('vitest overrides standalone', () => {
    // Verify the vitest overrides work correctly
    const config = [...nodeBase, ...typescript, ...vitestOverrides]

    test('applies vitest rules to *.test.ts', async () => {
      const rules = await getRulesForFile(config, 'src/index.test.ts')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('applies vitest rules to *.spec.ts', async () => {
      const rules = await getRulesForFile(config, 'test/example.spec.ts')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('applies vitest rules to *.test.js', async () => {
      const rules = await getRulesForFile(config, 'test/example.test.js')
      expect(rules).toHaveProperty('vitest/consistent-test-it')
    })

    test('relaxes rules for benchmark files', async () => {
      const rules = await getRulesForFile(config, 'test/example.bench.ts')
      // Benchmark files should have vitest rules relaxed
      expect(normalizeSeverity(rules['vitest/expect-expect'])).toBe('off')
    })
  })
})
