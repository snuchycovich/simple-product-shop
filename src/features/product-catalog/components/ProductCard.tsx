interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <button
        type="button"
        onClick={() => onAddToCart(product)}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add to cart
      </button>
    </div>
  )
}
