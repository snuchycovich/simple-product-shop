import { createContext } from 'react'
import type { DiscountBreakdown } from '@/shared/strategies/DiscountCalculator'
import type { CartItem, Product } from '@/shared/types'

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  discount: number
  total: number
  discountBreakdown: DiscountBreakdown[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
)
