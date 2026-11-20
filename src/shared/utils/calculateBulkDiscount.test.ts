import { describe, expect, it } from 'vitest'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem, Product } from '@/shared/types'
import { calculateBulkDiscount } from './calculateBulkDiscount'

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

describe('calculateBulkDiscount', () => {
  it('returns 0 when the quantity is below the minimum', () => {
    const items = [createItem(1, 50, MIN_QUANTITY - 1)]

    expect(calculateBulkDiscount(items)).toBe(0)
  })

  it('applies the bulk rate to an item with exactly the minimum quantity', () => {
    const items = [createItem(1, 20, MIN_QUANTITY)]

    expect(calculateBulkDiscount(items)).toBeCloseTo(20 * MIN_QUANTITY * RATE, 2)
  })

  it('applies the bulk rate to an item above the minimum quantity', () => {
    const quantity = MIN_QUANTITY + 5
    const items = [createItem(1, 20, quantity)]

    expect(calculateBulkDiscount(items)).toBeCloseTo(20 * quantity * RATE, 2)
  })

  it('only discounts the items that qualify', () => {
    const items = [
      createItem(1, 10, MIN_QUANTITY),
      createItem(2, 100, MIN_QUANTITY - 1),
      createItem(3, 20, MIN_QUANTITY + 1),
    ]

    const expected = (10 * MIN_QUANTITY + 20 * (MIN_QUANTITY + 1)) * RATE

    expect(calculateBulkDiscount(items)).toBeCloseTo(expected, 2)
  })
})
