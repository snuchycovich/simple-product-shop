import { describe, expect, it } from 'vitest'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem, Product } from '@/shared/types'
import { calculateSubtotal } from '@/shared/utils'
import { BulkDiscountStrategy } from './BulkDiscountStrategy'
import type { DiscountStrategy } from './DiscountStrategy'

const { MIN_QUANTITY, RATE } = BUSINESS_RULES.BULK_DISCOUNT

const createItem = (id: number, price: number, quantity: number): CartItem => {
  const product: Product = {
    id,
    name: `Product ${id}`,
    price,
    image: `/images/product-${id}.jpg`,
    description: `Description ${id}`,
  }
  return { product, quantity }
}

const strategy: DiscountStrategy = new BulkDiscountStrategy()

describe('BulkDiscountStrategy', () => {
  it('has the name "Bulk Discount"', () => {
    expect(strategy.name).toBe('Bulk Discount')
  })

  it('is not applicable when no item reaches the minimum quantity', () => {
    const items = [
      createItem(1, 20, MIN_QUANTITY - 1),
      createItem(2, 10, 1),
    ]

    expect(strategy.isApplicable(items, calculateSubtotal(items))).toBe(false)
  })

  it('is not applicable for an empty cart', () => {
    expect(strategy.isApplicable([], 0)).toBe(false)
  })

  it('is applicable when at least one item reaches the minimum quantity', () => {
    const items = [
      createItem(1, 20, MIN_QUANTITY),
      createItem(2, 10, 1),
    ]

    expect(strategy.isApplicable(items, calculateSubtotal(items))).toBe(true)
  })

  it('calculates the bulk rate of the subtotal of a qualifying item', () => {
    const items = [createItem(1, 20, MIN_QUANTITY)]

    expect(
      strategy.calculate(items, calculateSubtotal(items)),
    ).toBeCloseTo(20 * MIN_QUANTITY * RATE, 2)
  })

  it('only discounts the items that qualify when there are several items', () => {
    const items = [
      createItem(1, 10, MIN_QUANTITY),
      createItem(2, 100, MIN_QUANTITY - 1),
      createItem(3, 20, MIN_QUANTITY + 1),
    ]

    const expected = (10 * MIN_QUANTITY + 20 * (MIN_QUANTITY + 1)) * RATE

    expect(
      strategy.calculate(items, calculateSubtotal(items)),
    ).toBeCloseTo(expected, 2)
  })

  it('returns 0 when no item qualifies', () => {
    const items = [createItem(1, 50, MIN_QUANTITY - 1)]

    expect(strategy.calculate(items, calculateSubtotal(items))).toBe(0)
  })
})
