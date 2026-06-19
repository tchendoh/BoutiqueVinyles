import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const { id, title, artist, genre, price, image_url } = product

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img
          src={image_url || '/placeholder.jpg'}
          alt={`${title} — ${artist}`}
          className="product-card__image"
        />
      </div>
      <div className="product-card__info">
        <div className="product-card__meta">
          <span className="product-card__genre">{genre}</span>
          <span className="product-card__price">{price} $</span>
        </div>
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__artist">{artist}</p>
      </div>
    </Link>
  )
}

export default ProductCard
