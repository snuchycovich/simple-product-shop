import type { CartItem } from '@/shared/types'

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce(
    (subtotal, { product, quantity }) => subtotal + product.price * quantity,
    0,
  )
}
