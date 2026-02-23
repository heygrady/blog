import { describe, expect, test } from 'vitest'

import * as browserEntry from '../src/browser.js'
import * as nodeEntry from '../src/node.js'

describe('ts-browser-node-esm', () => {
  test('has distinct browser and node entry points', () => {
    expect(nodeEntry.runtime).toBe('node')
    expect(browserEntry.runtime).toBe('browser')
  })
})
