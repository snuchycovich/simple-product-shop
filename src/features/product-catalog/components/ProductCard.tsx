import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { UI_TEXT } from '@/shared/constants/ui'
import type { Product } from '@/shared/types'
import { formatPrice } from '@/shared/utils'

const SUCCESS_FEEDBACK_MS = 1500
const ERROR_FEEDBACK_MS = 3000

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

const BUTTON_CLASSES: Record<ButtonStatus, string> = {
  idle: 'bg-blue-600 hover:bg-blue-700',
  loading: 'cursor-wait bg-gray-500',
  success: 'bg-green-600',
  error: 'bg-red-600 hover:bg-red-700',
}

const BUTTON_CONTENT: Record<ButtonStatus, ReactNode> = {
  idle: UI_TEXT.addToCart,
  loading: (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth={3}
          className="opacity-25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
      {UI_TEXT.adding}
    </>
  ),
  success: (
    <>
      <span aria-hidden="true">✓</span>
      {UI_TEXT.added}
    </>
  ),
  error: UI_TEXT.failedRetry,
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void | Promise<void>
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const nameId = useId()
  const [status, setStatus] = useState<ButtonStatus>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const settle = (outcome: 'success' | 'error') => {
    if (!isMountedRef.current) return

    setStatus(outcome)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(
      () => setStatus('idle'),
      outcome === 'success' ? SUCCESS_FEEDBACK_MS : ERROR_FEEDBACK_MS,
    )
  }

  const handleClick = () => {
    clearTimeout(timeoutRef.current)

    let result: void | Promise<void>
    try {
      result = onAddToCart(product)
    } catch {
      settle('error')
      return
    }

    if (!(result instanceof Promise)) {
      settle('success')
      return
    }

    setStatus('loading')
    result.then(
      () => settle('success'),
      () => settle('error'),
    )
  }

  const announcements: Record<ButtonStatus, string> = {
    idle: '',
    loading: `Adding ${product.name} to cart`,
    success: `${product.name} added to cart`,
    error: `Could not add ${product.name} to cart`,
  }

  return (
    <div
      data-testid="product-card"
      className="w-fit rounded-lg bg-white p-4 shadow-md"
    >
      <img
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        loading="lazy"
        decoding="async"
        className="mb-2 h-[200px] w-[300px] rounded object-cover"
      />
      <h3 id={nameId} className="text-lg font-semibold">
        {product.name}
      </h3>
      <p
        title={product.description}
        className="line-clamp-2 max-w-[300px] text-sm text-gray-500"
      >
        {product.description}
      </p>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
      <button
        type="button"
        aria-describedby={nameId}
        aria-busy={status === 'loading'}
        disabled={status === 'loading'}
        onClick={handleClick}
        className={`mt-2 inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-white ${BUTTON_CLASSES[status]}`}
      >
        {BUTTON_CONTENT[status]}
      </button>
      <span role="status" className="sr-only">
        {announcements[status]}
      </span>
    </div>
  )
}
