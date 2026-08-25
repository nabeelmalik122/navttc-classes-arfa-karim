import './ProductCard.css';

export default function ProductCard({ title, description, price, originalPrice, rating, reviews, badge, badgeClass, image }) {
  return (
    <div className="product-card">
      <div className="image-container">
        <span className={`badge ${badgeClass}`}>{badge}</span>
        <img src={image} alt={title} />
      </div>

      <div className="card-body">
        <h3 className="product-title">{title}</h3>
        <p className="product-desc">{description}</p>
        
        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="reviews">({reviews})</span>
        </div>

        <div className="price-row">
          <span className="current-price">${price}</span>
          {originalPrice && <span className="old-price">${originalPrice}</span>}
        </div>

        <button className="add-btn">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}