import { describe, expect, it } from 'vitest'
import { UI_TEXT } from './ui'

describe('UI_TEXT.itemCount', () => {
  it('uses the singular for exactly one item', () => {
    expect(UI_TEXT.itemCount(1)).toBe('1 item')
  })

  it('uses the plural for zero items', () => {
    expect(UI_TEXT.itemCount(0)).toBe('0 items')
  })

  it('uses the plural for several items', () => {
    expect(UI_TEXT.itemCount(3)).toBe('3 items')
  })
})
