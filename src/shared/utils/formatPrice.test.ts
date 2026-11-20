import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats whole numbers with two decimals', () => {
    expect(formatPrice(10)).toBe('$10.00')
  })

  it('formats decimal numbers', () => {
    expect(formatPrice(29.99)).toBe('$29.99')
  })

  it('pads a single decimal digit with a trailing zero', () => {
    expect(formatPrice(39.5)).toBe('$39.50')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('rounds to two decimals', () => {
    expect(formatPrice(19.999)).toBe('$20.00')
  })

  it('adds a thousands separator to large numbers', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })

  it('adds multiple thousands separators to very large numbers', () => {
    expect(formatPrice(1234567.89)).toBe('$1,234,567.89')
  })
})
