import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

const VARIANTS = ['text', 'rectangular', 'circular'] as const

const getSkeleton = () => screen.getByRole('status')

describe('Skeleton', () => {
  describe('accessibility', () => {
    it('has role="status"', () => {
      render(<Skeleton />)

      expect(getSkeleton()).toBeInTheDocument()
    })

    it('has an accessible name telling the content is loading', () => {
      render(<Skeleton />)

      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    })
  })

  describe('animation', () => {
    it('renders with the pulse animation', () => {
      render(<Skeleton />)

      expect(getSkeleton()).toHaveClass('animate-pulse')
    })

    it.each(VARIANTS)('animates the %s variant', (variant) => {
      render(<Skeleton variant={variant} />)

      expect(getSkeleton()).toHaveClass('animate-pulse')
    })
  })

  describe('variants', () => {
    it('uses the text variant by default', () => {
      render(<Skeleton />)

      expect(getSkeleton()).toHaveClass('rounded')
      expect(getSkeleton()).not.toHaveClass('rounded-md', 'rounded-full')
    })

    it('applies the classes of the text variant', () => {
      render(<Skeleton variant="text" />)

      expect(getSkeleton()).toHaveClass('rounded')
      expect(getSkeleton()).not.toHaveClass('rounded-md')
      expect(getSkeleton()).not.toHaveClass('rounded-full')
    })

    it('applies the classes of the rectangular variant', () => {
      render(<Skeleton variant="rectangular" />)

      expect(getSkeleton()).toHaveClass('rounded-md')
      expect(getSkeleton()).not.toHaveClass('rounded-full')
    })

    it('applies the classes of the circular variant', () => {
      render(<Skeleton variant="circular" />)

      expect(getSkeleton()).toHaveClass('rounded-full')
      expect(getSkeleton()).not.toHaveClass('rounded-md')
    })

    it('uses a different set of classes for each variant', () => {
      const classNames = VARIANTS.map((variant) => {
        const { unmount } = render(<Skeleton variant={variant} />)
        const className = getSkeleton().className
        unmount()
        return className
      })

      expect(new Set(classNames).size).toBe(VARIANTS.length)
    })

    it('gives the circular variant a fully rounded border radius', () => {
      render(<Skeleton variant="circular" width={48} height={48} />)

      expect(getSkeleton()).toHaveClass('rounded-full')
      expect(getSkeleton()).toHaveStyle({ width: '48px', height: '48px' })
    })
  })

  describe('custom size', () => {
    it('accepts a numeric width and height as pixels', () => {
      render(<Skeleton width={120} height={40} />)

      expect(getSkeleton()).toHaveStyle({ width: '120px', height: '40px' })
    })

    it('accepts a width and height as CSS strings', () => {
      render(<Skeleton width="50%" height="2rem" />)

      // Checked on the inline style: jsdom's computed style turns rem into px
      expect(getSkeleton().style.width).toBe('50%')
      expect(getSkeleton().style.height).toBe('2rem')
    })

    it('accepts only a width', () => {
      render(<Skeleton width={200} />)

      expect(getSkeleton()).toHaveStyle({ width: '200px' })
      expect(getSkeleton().style.height).toBe('')
    })

    it('accepts only a height', () => {
      render(<Skeleton height={16} />)

      expect(getSkeleton()).toHaveStyle({ height: '16px' })
      expect(getSkeleton().style.width).toBe('')
    })
  })
})
