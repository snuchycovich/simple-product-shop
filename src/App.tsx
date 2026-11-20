import { ProductCard } from './features/product-catalog/components/ProductCard'

const product = {
  id: 1,
  name: 'Wireless Headphones',
  price: 29.99,
  image:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
}

function App() {
  return (
    <main className="p-8">
      <ProductCard
        product={product}
        onAddToCart={(item) => console.log('Add to cart:', item)}
      />
    </main>
  )
}

export default App
