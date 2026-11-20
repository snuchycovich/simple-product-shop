import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { CartItem, Product } from '@/shared/types'
import { CartProvider } from './CartContext'
import { useCart } from './useCart'

const STORAGE_KEY = 'cart'

const headphones: Product = {
  id: 1,
  name: 'Wireless Headphones',
  price: 10,
  image: '/images/headphones.jpg',
  description: 'Over-ear Bluetooth headphones.',
}

const keyboard: Product = {
  id: 2,
  name: 'Mechanical Keyboard',
  price: 25.5,
  image: '/images/keyboard.jpg',
  description: 'Compact mechanical keyboard.',
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

const renderCart = () => renderHook(() => useCart(), { wrapper })

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty cart', () => {
    const { result } = renderCart()

    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('addItem adds a new product with quantity 1', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(headphones))

    expect(result.current.items).toEqual([{ product: headphones, quantity: 1 }])
  })

  it('addItem increments the quantity when the product already exists', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(headphones)
      result.current.addItem(headphones)
    })

    expect(result.current.items).toEqual([{ product: headphones, quantity: 2 }])
  })

  it('updateQuantity changes the quantity of an item', () => {
    const { result } = renderCart()
    act(() => result.current.addItem(headphones))

    act(() => result.current.updateQuantity(headphones.id, 5))

    expect(result.current.items[0].quantity).toBe(5)
  })

  it('updateQuantity with 0 removes the item', () => {
    const { result } = renderCart()
    act(() => result.current.addItem(headphones))

    act(() => result.current.updateQuantity(headphones.id, 0))

    expect(result.current.items).toEqual([])
  })

  it('removeItem removes an item from the cart', () => {
    const { result } = renderCart()
    act(() => {
      result.current.addItem(headphones)
      result.current.addItem(keyboard)
    })

    act(() => result.current.removeItem(headphones.id))

    expect(result.current.items).toEqual([{ product: keyboard, quantity: 1 }])
  })

  it('clearCart empties the whole cart', () => {
    const { result } = renderCart()
    act(() => {
      result.current.addItem(headphones)
      result.current.addItem(keyboard)
    })

    act(() => result.current.clearCart())

    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('itemCount sums the quantities of all items', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(headphones)
      result.current.addItem(headphones)
      result.current.addItem(keyboard)
    })

    expect(result.current.itemCount).toBe(3)
  })

  it('subtotal sums price × quantity of every item', () => {
    const { result } = renderCart()
    act(() => {
      result.current.addItem(headphones)
      result.current.addItem(keyboard)
    })

    act(() => {
      result.current.updateQuantity(headphones.id, 2)
      result.current.updateQuantity(keyboard.id, 3)
    })

    expect(result.current.subtotal).toBeCloseTo(2 * 10 + 3 * 25.5, 2)
  })

  it('persists the cart in localStorage', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(headphones))

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual([
      { product: headphones, quantity: 1 },
    ])
  })

  it('loads the cart from localStorage on startup', () => {
    const stored: CartItem[] = [{ product: keyboard, quantity: 4 }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    const { result } = renderCart()

    expect(result.current.items).toEqual(stored)
    expect(result.current.itemCount).toBe(4)
  })
})
