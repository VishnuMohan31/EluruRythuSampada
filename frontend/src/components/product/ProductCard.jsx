import React from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-overlay">
          <span className="view-details-btn">View Details</span>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-shg-badge">
          <span className="shg-icon">🏛</span>
          <span className="shg-name">{product.shg.name}</span>
        </div>
        
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-meta">
          <span className="product-category">
            {product.category.name}
          </span>
        </div>
        
        <div className="product-footer">
          <span className="product-views">
            👁 {product.viewCount.toLocaleString()} views
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
