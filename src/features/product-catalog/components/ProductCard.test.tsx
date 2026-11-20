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

    const advance = (ms: number) => {
      act(() => {
        vi.advanceTimersByTime(ms)
      })
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
})
