import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem } from '@/shared/types'
import { calculateBulkDiscount } from '@/shared/utils'
import type { DiscountStrategy } from './DiscountStrategy'

const { MIN_QUANTITY, RATE } = BUSINESS_RULES.BULK_DISCOUNT

export class BulkDiscountStrategy implements DiscountStrategy {
  name = 'Bulk Discount'
  description = `${Math.round(RATE * 100)}% off products with ${MIN_QUANTITY}+ units`

  isApplicable(items: CartItem[]): boolean {
    return items.some(({ quantity }) => quantity >= MIN_QUANTITY)
  }

  calculate(items: CartItem[]): number {
    return calculateBulkDiscount(items)
  }
}
