import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
      getProducts().then(data => setProducts(data))
  }, [])

  return (
    <div className="page">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default HomePage
