import { describe, expect, it } from 'vitest'
import type { CartItem, Product } from '@/shared/types'
import { calculateSubtotal } from './calculateSubtotal'

const createProduct = (id: number, price: number): Product => ({
  id,
  name: `Product ${id}`,
  price,
  image: `/images/product-${id}.jpg`,
  description: `Description ${id}`,
})

describe('calculateSubtotal', () => {
  it('returns 0 for an empty array', () => {
    expect(calculateSubtotal([])).toBe(0)
  })

  it('returns price × quantity for a single item', () => {
    const items: CartItem[] = [{ product: createProduct(1, 25), quantity: 3 }]

    expect(calculateSubtotal(items)).toBe(75)
  })

  it('returns the price for a single item with quantity 1', () => {
    const items: CartItem[] = [{ product: createProduct(1, 89.99), quantity: 1 }]

    expect(calculateSubtotal(items)).toBeCloseTo(89.99, 2)
  })

  it('sums price × quantity across multiple items', () => {
    const items: CartItem[] = [
      { product: createProduct(1, 10), quantity: 2 },
      { product: createProduct(2, 25.5), quantity: 1 },
      { product: createProduct(3, 4), quantity: 5 },
    ]

    expect(calculateSubtotal(items)).toBeCloseTo(65.5, 2)
  })
})
