import { beforeEach, describe, expect, it } from 'vitest'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem, Product } from '@/shared/types'
import { DiscountCalculator } from './DiscountCalculator'

const { RATE: BULK_RATE } = BUSINESS_RULES.BULK_DISCOUNT
const { RATE: ORDER_RATE } = BUSINESS_RULES.ORDER_DISCOUNT

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

describe('DiscountCalculator', () => {
  let calculator: DiscountCalculator

  beforeEach(() => {
    calculator = new DiscountCalculator()
  })

  it('returns 0 for an empty cart', () => {
    expect(calculator.calculate([])).toBe(0)
  })

  it('returns an empty breakdown for an empty cart', () => {
    expect(calculator.getBreakdown([])).toEqual([])
  })

  it('applies only the bulk discount when the subtotal is below the order minimum', () => {
    // subtotal: 10 × 5 = $50
    const items = [createItem(1, 10, 5)]

    expect(calculator.calculate(items)).toBeCloseTo(50 * BULK_RATE, 2)
    expect(calculator.getBreakdown(items).map(({ name }) => name)).toEqual([
      'Bulk Discount',
    ])
  })

  it('applies only the order discount when no item reaches the bulk quantity', () => {
    // subtotal: 60 × 2 = $120
    const items = [createItem(1, 60, 2)]

    expect(calculator.calculate(items)).toBeCloseTo(120 * ORDER_RATE, 2)
    expect(calculator.getBreakdown(items).map(({ name }) => name)).toEqual([
      'Order Discount',
    ])
  })

  it('applies both discounts sequentially, each over the remaining amount', () => {
    // subtotal: 25 × 5 = $125 → bulk -$12.50 → $112.50 → order -$16.875
    const items = [createItem(1, 25, 5)]

    expect(calculator.calculate(items)).toBeCloseTo(29.375, 3)
  })

  it('does not apply the order discount when the amount left after other discounts is below the minimum', () => {
    // subtotal: 21 × 5 = $105 → bulk -$10.50 → $94.50 (below $100)
    const items = [createItem(1, 21, 5)]

    expect(calculator.calculate(items)).toBeCloseTo(105 * BULK_RATE, 2)
    expect(calculator.getBreakdown(items).map(({ name }) => name)).toEqual([
      'Bulk Discount',
    ])
  })

  it('returns the name and amount of each applied discount in the breakdown', () => {
    const items = [createItem(1, 25, 5)]

    const breakdown = calculator.getBreakdown(items)

    expect(breakdown).toHaveLength(2)
    expect(breakdown[0].name).toBe('Bulk Discount')
    expect(breakdown[0].amount).toBeCloseTo(12.5, 3)
    expect(breakdown[1].name).toBe('Order Discount')
    expect(breakdown[1].amount).toBeCloseTo(16.875, 3)
  })

  it('has a breakdown that adds up to the calculated discount', () => {
    const items = [createItem(1, 25, 5), createItem(2, 10, 2)]

    const total = calculator
      .getBreakdown(items)
      .reduce((sum, { amount }) => sum + amount, 0)

    expect(calculator.calculate(items)).toBeCloseTo(total, 5)
  })
})
