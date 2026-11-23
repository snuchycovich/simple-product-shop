import { describe, expect, it } from 'vitest'
import { formatPercent } from './formatPercent'

describe('formatPercent', () => {
  it('formats a rate as a whole percentage', () => {
    expect(formatPercent(0.1)).toBe('10%')
    expect(formatPercent(0.15)).toBe('15%')
  })

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0%')
  })

  it('formats a full rate', () => {
    expect(formatPercent(1)).toBe('100%')
  })

  it('is not affected by floating point errors', () => {
    expect(formatPercent(0.07)).toBe('7%')
  })

  it('rounds to the nearest whole percentage', () => {
    expect(formatPercent(0.1549)).toBe('15%')
    expect(formatPercent(0.156)).toBe('16%')
  })
})
