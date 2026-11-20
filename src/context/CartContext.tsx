import { useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { DiscountCalculator } from '@/shared/strategies/DiscountCalculator'
import type { CartItem, Product } from '@/shared/types'
import { calculateSubtotal } from '@/shared/utils'
import { CartContext } from './CartContextValue'

const STORAGE_KEY = 'cart'
const discountCalculator = new DiscountCalculator()

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = items.some(({ product }) => product.id === action.product.id)

      if (!exists) {
        return [...items, { product: action.product, quantity: 1 }]
      }

      return items.map((item) =>
        item.product.id === action.product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    }
    case 'REMOVE_ITEM':
      return items.filter(({ product }) => product.id !== action.productId)
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return items.filter(({ product }) => product.id !== action.productId)
      }

      return items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item,
      )
    case 'CLEAR_CART':
      return []
  }
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const subtotal = calculateSubtotal(items)
  const discountBreakdown = useMemo(
    () => discountCalculator.getBreakdown(items),
    [items],
  )
  const discount = discountBreakdown.reduce(
    (total, { amount }) => total + amount,
    0,
  )

  const value = {
    items,
    itemCount: items.reduce((count, { quantity }) => count + quantity, 0),
    subtotal,
    discount,
    total: subtotal - discount,
    discountBreakdown,
    addItem: (product: Product) => dispatch({ type: 'ADD_ITEM', product }),
    removeItem: (productId: number) =>
      dispatch({ type: 'REMOVE_ITEM', productId }),
    updateQuantity: (productId: number, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
