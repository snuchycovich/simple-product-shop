import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from '@/context/CartContext'
import { useCart } from '@/context/useCart'
import type { CartItem, Product } from '@/shared/types'
import { ShoppingCart } from './ShoppingCart'

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

const renderCart = (storedItems: CartItem[] = []) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems))

  return render(
    <CartProvider>
      <ShoppingCart />
    </CartProvider>,
  )
}

describe('ShoppingCart', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('when the cart is empty', () => {
    it('shows the title with a 0 badge', () => {
      renderCart()

      expect(
        screen.getByRole('heading', { name: 'Shopping Cart' }),
      ).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('describes the badge for screen readers', () => {
      renderCart()

      expect(
        screen.getByRole('img', { name: '0 items in cart' }),
      ).toBeInTheDocument()
    })

    it('shows the empty cart message', () => {
      renderCart()

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })

    it('does not show the summary or the checkout button', () => {
      renderCart()

      expect(
        screen.queryByRole('button', { name: /checkout/i }),
      ).not.toBeInTheDocument()
      expect(screen.queryByText('Subtotal')).not.toBeInTheDocument()
    })
  })

  describe('when the cart has items', () => {
    const items: CartItem[] = [
      { product: headphones, quantity: 2 },
      { product: keyboard, quantity: 1 },
    ]

    it('shows the total item count in the badge', () => {
      renderCart(items)

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('describes the badge with the total number of items', () => {
      renderCart(items)

      expect(
        screen.getByRole('img', { name: '3 items in cart' }),
      ).toBeInTheDocument()
    })

    it('uses the singular in the badge description for one item', () => {
      renderCart([{ product: headphones, quantity: 1 }])

      expect(
        screen.getByRole('img', { name: '1 item in cart' }),
      ).toBeInTheDocument()
    })

    it('does not show the empty cart message', () => {
      renderCart(items)

      expect(screen.queryByText('Your cart is empty')).not.toBeInTheDocument()
    })

    it('renders one entry per item', () => {
      renderCart(items)

      expect(screen.getAllByRole('listitem')).toHaveLength(2)
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
      expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument()
    })

    it('shows the summary with subtotal, total and checkout', () => {
      renderCart(items)

      // 10 × 2 + 25.50 × 1 = $45.50, no discount applies
      expect(screen.getAllByText('$45.50')).toHaveLength(2)
      expect(
        screen.getByRole('button', { name: /checkout/i }),
      ).toBeInTheDocument()
    })

    it('shows the discount breakdown when a discount applies', () => {
      renderCart([{ product: headphones, quantity: 5 }])

      // 10 × 5 = $50 → bulk 10% = $5
      expect(screen.getByText('Bulk Discount')).toBeInTheDocument()
      expect(screen.getByText('-$5.00')).toBeInTheDocument()
      expect(screen.getByText('$45.00')).toBeInTheDocument()
    })

    it('increases the quantity of an item with the + button', async () => {
      const user = userEvent.setup()
      renderCart([{ product: headphones, quantity: 2 }])
      const entry = within(screen.getByRole('listitem'))

      await user.click(
        entry.getByRole('button', {
          name: 'Increase quantity of Wireless Headphones',
        }),
      )

      expect(entry.getByText('3')).toBeInTheDocument()
    })

    it('decreases the quantity of an item with the - button', async () => {
      const user = userEvent.setup()
      renderCart([{ product: headphones, quantity: 2 }])
      const entry = within(screen.getByRole('listitem'))

      await user.click(
        entry.getByRole('button', {
          name: 'Decrease quantity of Wireless Headphones',
        }),
      )

      expect(entry.getByText('1')).toBeInTheDocument()
    })

    it('removes an item with the remove button', async () => {
      const user = userEvent.setup()
      renderCart(items)

      await user.click(
        screen.getByRole('button', {
          name: 'Remove Wireless Headphones from cart',
        }),
      )

      expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument()
      expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument()
    })

    it('shows the empty message after removing the last item', async () => {
      const user = userEvent.setup()
      renderCart([{ product: headphones, quantity: 1 }])

      await user.click(
        screen.getByRole('button', {
          name: 'Remove Wireless Headphones from cart',
        }),
      )

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })
  })

  describe('screen reader announcements', () => {
    const getAnnouncer = () => screen.getByTestId('cart-announcer')

    function AddHeadphonesButton() {
      const { addItem } = useCart()
      return (
        <button type="button" onClick={() => addItem(headphones)}>
          Add headphones
        </button>
      )
    }

    it('has a polite, atomic live region', () => {
      renderCart()

      expect(getAnnouncer()).toHaveAttribute('aria-live', 'polite')
      expect(getAnnouncer()).toHaveAttribute('aria-atomic', 'true')
    })

    it('hides the live region visually with sr-only', () => {
      renderCart()

      expect(getAnnouncer()).toHaveClass('sr-only')
    })

    it('announces nothing on the first render', () => {
      renderCart([{ product: headphones, quantity: 2 }])

      expect(getAnnouncer()).toBeEmptyDOMElement()
    })

    it('announces the item count and total when a product is added', async () => {
      const user = userEvent.setup()
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
      render(
        <CartProvider>
          <AddHeadphonesButton />
          <ShoppingCart />
        </CartProvider>,
      )

      await user.click(screen.getByRole('button', { name: 'Add headphones' }))

      expect(getAnnouncer()).toHaveTextContent(
        'Cart updated: 1 item, total $10.00',
      )
    })

    it.each([
      {
        scenario: 'the quantity increases',
        quantity: 2,
        button: 'Increase',
        expected: 'Cart updated: 3 items, total $30.00',
      },
      {
        scenario: 'the quantity decreases',
        quantity: 2,
        button: 'Decrease',
        expected: 'Cart updated: 1 item, total $10.00',
      },
      {
        // 10 × 5 = $50 → bulk 10% = $45
        scenario: 'a discount starts to apply',
        quantity: 4,
        button: 'Increase',
        expected: 'Cart updated: 5 items, total $45.00',
      },
    ])(
      'announces the new count and total when $scenario',
      async ({ quantity, button, expected }) => {
        const user = userEvent.setup()
        renderCart([{ product: headphones, quantity }])

        await user.click(
          screen.getByRole('button', {
            name: `${button} quantity of Wireless Headphones`,
          }),
        )

        expect(getAnnouncer()).toHaveTextContent(expected)
      },
    )

    it('announces that the cart is empty after removing the last item', async () => {
      const user = userEvent.setup()
      renderCart([{ product: headphones, quantity: 1 }])

      await user.click(
        screen.getByRole('button', {
          name: 'Remove Wireless Headphones from cart',
        }),
      )

      expect(getAnnouncer()).toHaveTextContent('Cart is empty')
    })
  })
})
