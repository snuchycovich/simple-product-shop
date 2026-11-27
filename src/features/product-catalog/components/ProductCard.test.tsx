import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProductCard } from './ProductCard'

const product = {
  id: 1,
  name: 'Wireless Headphones',
  price: 29.99,
  image: '/images/headphones.jpg',
  description: 'Over-ear Bluetooth headphones with noise cancellation.',
}

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('ProductCard', () => {
  it('shows the product name', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
  })

  it('shows the price formatted as $XX.XX', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('formats whole-number prices with two decimals', () => {
    render(
      <ProductCard product={{ ...product, price: 10 }} onAddToCart={vi.fn()} />,
    )

    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  it('shows the product image with the product name as alt text', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    const image = screen.getByRole('img', { name: 'Wireless Headphones' })

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/headphones.jpg')
  })

  it('sets an explicit width and height on the image', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    const image = screen.getByRole('img', { name: 'Wireless Headphones' })

    expect(Number(image.getAttribute('width'))).toBeGreaterThan(0)
    expect(Number(image.getAttribute('height'))).toBeGreaterThan(0)
  })

  it('shows the product description', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(
      screen.getByText('Over-ear Bluetooth headphones with noise cancellation.'),
    ).toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(
      screen.getByText('Over-ear Bluetooth headphones with noise cancellation.'),
    ).toHaveClass('line-clamp-2')
  })

  it('exposes the full description in a title attribute', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(
      screen.getByText('Over-ear Bluetooth headphones with noise cancellation.'),
    ).toHaveAttribute(
      'title',
      'Over-ear Bluetooth headphones with noise cancellation.',
    )
  })

  it('has an "Add to cart" button', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument()
  })

  it('describes the add to cart button with the product name for screen readers', () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toHaveAccessibleDescription('Wireless Headphones')
  })

  it('calls onAddToCart with the product when the button is clicked', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductCard product={product} onAddToCart={onAddToCart} />)

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(product)
  })

  it('does not call onAddToCart before the button is clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard product={product} onAddToCart={onAddToCart} />)

    expect(onAddToCart).not.toHaveBeenCalled()
  })

  describe('added feedback', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const setup = () => {
      const onAddToCart = vi.fn()
      render(<ProductCard product={product} onAddToCart={onAddToCart} />)
      const button = screen.getByRole('button', { name: /add to cart/i })
      return { button, onAddToCart }
    }

    it('shows "Added!" after clicking the button', () => {
      const { button } = setup()

      fireEvent.click(button)

      expect(screen.getByRole('button', { name: 'Added!' })).toBeInTheDocument()
    })

    it('styles the button in green while it shows "Added!"', () => {
      const { button } = setup()

      fireEvent.click(button)

      expect(button).toHaveClass('bg-green-600')
    })

    it('keeps showing "Added!" before 1.5 seconds have passed', () => {
      const { button } = setup()
      fireEvent.click(button)

      advance(1499)

      expect(button).toHaveTextContent('Added!')
    })

    it('goes back to "Add to cart" after 1.5 seconds', () => {
      const { button } = setup()
      fireEvent.click(button)

      advance(1500)

      expect(button).toHaveTextContent(/add to cart/i)
      expect(button).not.toHaveClass('bg-green-600')
    })

    it('still calls onAddToCart while showing "Added!"', () => {
      const { button, onAddToCart } = setup()

      fireEvent.click(button)
      fireEvent.click(button)

      expect(onAddToCart).toHaveBeenCalledTimes(2)
    })

    it('restarts the 1.5 seconds when clicked again during the transition', () => {
      const { button } = setup()

      fireEvent.click(button)
      advance(1000)
      fireEvent.click(button)
      advance(1000)

      expect(button).toHaveTextContent('Added!')

      advance(500)

      expect(button).toHaveTextContent(/add to cart/i)
    })
  })

  describe('async add to cart', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const setup = () => {
      let resolveAdd: (() => void) | undefined
      let rejectAdd: ((error: Error) => void) | undefined
      const onAddToCart = vi.fn(
        () =>
          new Promise<void>((resolve, reject) => {
            resolveAdd = resolve
            rejectAdd = reject
          }),
      )
      render(<ProductCard product={product} onAddToCart={onAddToCart} />)
      const button = screen.getByRole('button', { name: /add to cart/i })

      return {
        button,
        onAddToCart,
        succeed: () => act(async () => resolveAdd?.()),
        fail: () => act(async () => rejectAdd?.(new Error('Network error'))),
      }
    }

    it('shows "Adding..." in gray with a spinner as soon as the button is clicked', () => {
      const { button } = setup()

      fireEvent.click(button)

      expect(button).toHaveTextContent('Adding...')
      expect(button).toHaveClass('bg-gray-500')
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('disables the button while loading and ignores extra clicks', () => {
      const { button, onAddToCart } = setup()

      fireEvent.click(button)
      fireEvent.click(button)

      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(onAddToCart).toHaveBeenCalledTimes(1)
    })

    it('shows "Added!" in green with a checkmark when the promise resolves', async () => {
      const { button, succeed } = setup()
      fireEvent.click(button)

      await succeed()

      expect(button).toHaveTextContent('Added!')
      expect(button).toHaveClass('bg-green-600')
      expect(button).toBeEnabled()
      expect(button).not.toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveTextContent('✓')
    })

    it('shows "Failed" in red with a retry option when the promise rejects', async () => {
      const { button, fail } = setup()
      fireEvent.click(button)

      await fail()

      expect(button).toHaveTextContent('Failed')
      expect(button).toHaveTextContent(/retry/i)
      expect(button).toHaveClass('bg-red-600')
      expect(button).toBeEnabled()
    })

    it('shows "Failed" when onAddToCart throws synchronously', () => {
      const onAddToCart = vi.fn(() => {
        throw new Error('Out of stock')
      })
      render(<ProductCard product={product} onAddToCart={onAddToCart} />)
      const button = screen.getByRole('button', { name: /add to cart/i })

      fireEvent.click(button)

      expect(button).toHaveTextContent('Failed')
      expect(button).toHaveClass('bg-red-600')
    })

    it('calls onAddToCart again and goes back to loading when retrying', async () => {
      const { button, onAddToCart, fail, succeed } = setup()
      fireEvent.click(button)
      await fail()

      fireEvent.click(button)

      expect(onAddToCart).toHaveBeenCalledTimes(2)
      expect(button).toHaveTextContent('Adding...')

      await succeed()

      expect(button).toHaveTextContent('Added!')
    })

    it('goes back to idle 1.5 seconds after succeeding', async () => {
      const { button, succeed } = setup()
      fireEvent.click(button)
      await succeed()

      advance(1499)
      expect(button).toHaveTextContent('Added!')

      advance(1)
      expect(button).toHaveTextContent(/add to cart/i)
      expect(button).toHaveClass('bg-blue-600')
    })

    it('goes back to idle 3 seconds after failing', async () => {
      const { button, fail } = setup()
      fireEvent.click(button)
      await fail()

      advance(2999)
      expect(button).toHaveTextContent('Failed')

      advance(1)
      expect(button).toHaveTextContent(/add to cart/i)
      expect(button).toHaveClass('bg-blue-600')
    })

    it('shows no timer-based change while the request is still loading', () => {
      const { button } = setup()
      fireEvent.click(button)

      advance(10_000)

      expect(button).toHaveTextContent('Adding...')
    })

    it('announces each state to screen readers', async () => {
      const { button, succeed, fail } = setup()
      const announcement = screen.getByRole('status')
      expect(announcement).toBeEmptyDOMElement()

      fireEvent.click(button)
      expect(announcement).toHaveTextContent('Adding Wireless Headphones to cart')

      await succeed()
      expect(announcement).toHaveTextContent('Wireless Headphones added to cart')

      fireEvent.click(button)
      await fail()
      expect(announcement).toHaveTextContent(
        'Could not add Wireless Headphones to cart',
      )
    })

    it('does not leave timers behind when unmounted while loading', async () => {
      const onAddToCart = vi.fn(() => Promise.resolve())
      const { unmount } = render(
        <ProductCard product={product} onAddToCart={onAddToCart} />,
      )

      fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))
      unmount()
      await act(async () => undefined)

      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
