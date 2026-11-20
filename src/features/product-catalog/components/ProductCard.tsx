import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/shared/types'
import { formatPrice } from '@/shared/utils'

const ADDED_FEEDBACK_MS = 1500

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [status, setStatus] = useState<'idle' | 'added'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const handleClick = () => {
    onAddToCart(product)
    setStatus('added')
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setStatus('idle'), ADDED_FEEDBACK_MS)
  }

  const isAdded = status === 'added'

  return (
    <div className="w-fit rounded-lg bg-white p-4 shadow-md">
      <img
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        loading="lazy"
        decoding="async"
        className="mb-2 h-[200px] w-[300px] rounded object-cover"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p
        title={product.description}
        className="line-clamp-2 max-w-[300px] text-sm text-gray-500"
      >
        {product.description}
      </p>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
      <button
        type="button"
        onClick={handleClick}
        className={`mt-2 rounded px-4 py-2 text-white ${
          isAdded ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isAdded ? 'Added!' : 'Add to cart'}
      </button>
    </div>
  )
}
