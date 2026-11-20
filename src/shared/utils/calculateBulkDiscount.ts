import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem } from '@/shared/types'

const { MIN_QUANTITY, RATE } = BUSINESS_RULES.BULK_DISCOUNT

export function calculateBulkDiscount(items: CartItem[]): number {
  return items
    .filter(({ quantity }) => quantity >= MIN_QUANTITY)
    .reduce(
      (discount, { product, quantity }) =>
        discount + product.price * quantity * RATE,
      0,
    )
}
