import { describe, test, expect } from 'vitest'

import astroReact from '../../astro-react.js'
import astroSolid from '../../astro-solid.js'
import astro from '../../astro.js'
import node from '../../node.js'
import tsNodeEsm from '../../ts-node-esm.js'
import tsxReactEsm from '../../tsx-react-esm.js'
import tsxSolidEsm from '../../tsx-solid-esm.js'
import zx from '../../zx.js'
import { getConfigSummary } from '../utils/index.js'

describe('config snapshots', () => {
  describe('ts-node-esm preset', () => {
    const config = tsNodeEsm

    test('computed config for src/index.ts', async () => {
      const summary = await getConfigSummary(config, 'src/index.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })

    test('computed config for src/index.js', async () => {
      const summary = await getConfigSummary(config, 'src/index.js')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })

    test('computed config for test/example.test.ts', async () => {
      const summary = await getConfigSummary(config, 'test/example.test.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })

    test('computed config for vitest.config.ts', async () => {
      const summary = await getConfigSummary(config, 'vitest.config.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })

    test('computed config for README.md', async () => {
      const summary = await getConfigSummary(config, 'README.md')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })

    test('computed config for package.json', async () => {
      const summary = await getConfigSummary(config, 'package.json')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })

    test('computed config for eslint.config.mjs', async () => {
      const summary = await getConfigSummary(config, 'eslint.config.mjs')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })
  })

  describe('astro-solid preset', () => {
    const config = astroSolid

    test('computed config for src/index.ts', async () => {
      const summary = await getConfigSummary(config, 'src/index.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })

    test('computed config for src/Component.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
      expect(
        summary.globals.filter((g) =>
          ['window', 'document', 'navigator'].includes(g)
        )
      ).toMatchSnapshot('browser-globals')
    })

    test('computed config for src/Page.astro', async () => {
      const summary = await getConfigSummary(config, 'src/Page.astro')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })

    test('computed config for src/Component.test.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.test.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })

    test('computed config for test/example.bench.ts', async () => {
      const summary = await getConfigSummary(config, 'test/example.bench.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parserOptions).toMatchSnapshot('parserOptions')
    })
  })

  describe('node preset', () => {
    const config = node

    test('computed config for src/index.js', async () => {
      const summary = await getConfigSummary(config, 'src/index.js')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })

    test('computed config for src/index.test.js', async () => {
      const summary = await getConfigSummary(config, 'src/index.test.js')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })
  })

  describe('zx preset', () => {
    const config = zx

    test('computed config for scripts/build.mjs', async () => {
      const summary = await getConfigSummary(config, 'scripts/build.mjs')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(
        summary.globals.filter((g) =>
          ['$', 'cd', 'chalk', 'fs', 'path'].includes(g)
        )
      ).toMatchSnapshot('zx-globals')
    })
  })

  describe('tsx-react-esm preset', () => {
    const config = tsxReactEsm

    test('computed config for src/Component.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })

    test('computed config for src/Component.test.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.test.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })
  })

  describe('tsx-solid-esm preset', () => {
    const config = tsxSolidEsm

    test('computed config for src/Component.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })

    test('computed config for src/Component.test.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.test.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })
  })

  describe('astro preset (no UI framework)', () => {
    const config = astro

    test('computed config for src/Page.astro', async () => {
      const summary = await getConfigSummary(config, 'src/Page.astro')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })

    test('computed config for src/index.ts', async () => {
      const summary = await getConfigSummary(config, 'src/index.ts')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })
  })

  describe('astro-react preset', () => {
    const config = astroReact

    test('computed config for src/Page.astro', async () => {
      const summary = await getConfigSummary(config, 'src/Page.astro')
      expect(summary.plugins).toMatchSnapshot('plugins')
      expect(summary.parser).toMatchSnapshot('parser')
    })

    test('computed config for src/Component.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })

    test('computed config for src/Component.test.tsx', async () => {
      const summary = await getConfigSummary(config, 'src/Component.test.tsx')
      expect(summary.plugins).toMatchSnapshot('plugins')
    })
  })

  describe('key rules snapshots', () => {
    describe('ts-node-esm', () => {
      const config = tsNodeEsm

      test('TypeScript rules for src/index.ts', async () => {
        const summary = await getConfigSummary(config, 'src/index.ts')
        const tsRules = Object.fromEntries(
          Object.entries(summary.rules).filter(([k]) =>
            k.startsWith('@typescript-eslint/')
          )
        )
        expect(tsRules).toMatchSnapshot()
      })

      test('import rules for src/index.ts', async () => {
        const summary = await getConfigSummary(config, 'src/index.ts')
        const importRules = Object.fromEntries(
          Object.entries(summary.rules).filter(([k]) => k.startsWith('import/'))
        )
        expect(importRules).toMatchSnapshot()
      })

      test('vitest rules for test/example.test.ts', async () => {
        const summary = await getConfigSummary(config, 'test/example.test.ts')
        const vitestRules = Object.fromEntries(
          Object.entries(summary.rules).filter(([k]) => k.startsWith('vitest/'))
        )
        expect(vitestRules).toMatchSnapshot()
      })
    })

    describe('astro-solid', () => {
      const config = astroSolid

      test('solid rules for src/Component.tsx', async () => {
        const summary = await getConfigSummary(config, 'src/Component.tsx')
        const solidRules = Object.fromEntries(
          Object.entries(summary.rules).filter(([k]) => k.startsWith('solid/'))
        )
        expect(solidRules).toMatchSnapshot()
      })

      test('astro rules for src/Page.astro', async () => {
        const summary = await getConfigSummary(config, 'src/Page.astro')
        const astroRules = Object.fromEntries(
          Object.entries(summary.rules).filter(([k]) => k.startsWith('astro/'))
        )
        expect(astroRules).toMatchSnapshot()
      })

      test('testing-library rules for src/Component.test.tsx', async () => {
        const summary = await getConfigSummary(config, 'src/Component.test.tsx')
        const testingLibraryRules = Object.fromEntries(
          Object.entries(summary.rules).filter(([k]) =>
            k.startsWith('testing-library/')
          )
        )
        expect(testingLibraryRules).toMatchSnapshot()
      })
    })
  })
})
