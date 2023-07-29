import { describe, expect, test } from 'vitest'

import { example } from '../src/index.js'

describe('example', () => {
  test('exists', () => {
    expect(example).toBe(true)
  })
})
