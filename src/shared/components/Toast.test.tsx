import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Toast } from './Toast'

const AUTO_CLOSE_MS = 3000

const VARIANT_CLASSES = [
  ['success', 'bg-green-600'],
  ['error', 'bg-red-600'],
  ['info', 'bg-blue-600'],
] as const

const getToast = () => screen.getByRole('alert')

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('Toast', () => {
  describe('accessibility', () => {
    it('renders the message inside an element with role="alert"', () => {
      render(<Toast message="Product added to cart" onClose={vi.fn()} />)

      expect(getToast()).toHaveTextContent('Product added to cart')
    })

    it('announces the message with aria-live', () => {
      render(<Toast message="Product added to cart" onClose={vi.fn()} />)

      expect(getToast()).toHaveAttribute('aria-live', 'assertive')
    })

    it('has a close button with an accessible name', () => {
      render(<Toast message="Product added to cart" onClose={vi.fn()} />)

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it.each(VARIANT_CLASSES)(
      'applies the %s color',
      (variant, expectedClass) => {
        render(
          <Toast message="Notification" variant={variant} onClose={vi.fn()} />,
        )

        expect(getToast()).toHaveClass(expectedClass)
      },
    )

    it.each(VARIANT_CLASSES)(
      'does not mix colors from other variants in the %s variant',
      (variant, expectedClass) => {
        render(
          <Toast message="Notification" variant={variant} onClose={vi.fn()} />,
        )

        const otherClasses = VARIANT_CLASSES.map(([, cls]) => cls).filter(
          (cls) => cls !== expectedClass,
        )

        for (const cls of otherClasses) {
          expect(getToast()).not.toHaveClass(cls)
        }
      },
    )

    it('uses the info variant by default', () => {
      render(<Toast message="Notification" onClose={vi.fn()} />)

      expect(getToast()).toHaveClass('bg-blue-600')
    })
  })

  describe('manual close', () => {
    it('calls onClose when the close button is clicked', async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(<Toast message="Notification" onClose={onClose} />)

      await user.click(screen.getByRole('button', { name: /close/i }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose before any interaction', () => {
      const onClose = vi.fn()
      render(<Toast message="Notification" onClose={onClose} />)

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('auto close', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not call onClose before 3 seconds have passed', () => {
      const onClose = vi.fn()
      render(<Toast message="Notification" onClose={onClose} />)

      advance(AUTO_CLOSE_MS - 1)

      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose after 3 seconds', () => {
      const onClose = vi.fn()
      render(<Toast message="Notification" onClose={onClose} />)

      advance(AUTO_CLOSE_MS)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose after being unmounted', () => {
      const onClose = vi.fn()
      const { unmount } = render(
        <Toast message="Notification" onClose={onClose} />,
      )

      unmount()
      advance(AUTO_CLOSE_MS)

      expect(onClose).not.toHaveBeenCalled()
      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
