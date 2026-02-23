import { describe, expect, test } from 'vitest'

import { message } from '../src/index.js'

describe('message', () => {
  test('exists', () => {
    expect(message).toBe('ts-browser-esm')
  })
})
