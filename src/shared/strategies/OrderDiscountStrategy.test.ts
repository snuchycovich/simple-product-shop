import { describe, expect, it } from 'vitest'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem } from '@/shared/types'
import type { DiscountStrategy } from './DiscountStrategy'
import { OrderDiscountStrategy } from './OrderDiscountStrategy'

const { MIN_SUBTOTAL, RATE } = BUSINESS_RULES.ORDER_DISCOUNT

const items: CartItem[] = [
  {
    product: {
      id: 1,
      name: 'Product 1',
      price: 50,
      image: '/images/product-1.jpg',
      description: 'Description 1',
    },
    quantity: 2,
  },
]

const strategy: DiscountStrategy = new OrderDiscountStrategy()

describe('OrderDiscountStrategy', () => {
  it('has the name "Order Discount"', () => {
    expect(strategy.name).toBe('Order Discount')
  })

  it('is not applicable when the subtotal is below the minimum', () => {
    expect(strategy.isApplicable(items, MIN_SUBTOTAL - 0.01)).toBe(false)
  })

  it('is applicable when the subtotal equals the minimum', () => {
    expect(strategy.isApplicable(items, MIN_SUBTOTAL)).toBe(true)
  })

  it('is applicable when the subtotal is above the minimum', () => {
    expect(strategy.isApplicable(items, MIN_SUBTOTAL + 50)).toBe(true)
  })

  it('calculates the order rate of the subtotal', () => {
    const subtotal = 200

    expect(strategy.calculate(items, subtotal)).toBeCloseTo(subtotal * RATE, 2)
  })

  it('calculates the rate of the amount it receives, so it can be applied after other discounts', () => {
    const amountAfterOtherDiscounts = 180

    expect(strategy.calculate(items, amountAfterOtherDiscounts)).toBeCloseTo(
      amountAfterOtherDiscounts * RATE,
      2,
    )
  })
})
