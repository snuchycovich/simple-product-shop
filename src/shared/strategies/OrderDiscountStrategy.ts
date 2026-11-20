import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem } from '@/shared/types'
import type { DiscountStrategy } from './DiscountStrategy'

const { MIN_SUBTOTAL, RATE } = BUSINESS_RULES.ORDER_DISCOUNT

export class OrderDiscountStrategy implements DiscountStrategy {
  name = 'Order Discount'
  description = `${Math.round(RATE * 100)}% off orders of $${MIN_SUBTOTAL}+`

  isApplicable(_items: CartItem[], subtotal: number): boolean {
    return subtotal >= MIN_SUBTOTAL
  }

  calculate(_items: CartItem[], subtotal: number): number {
    return subtotal * RATE
  }
}
