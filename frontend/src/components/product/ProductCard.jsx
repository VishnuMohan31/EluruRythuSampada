import React from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '@utils/api'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  // Handle image URL - use backend storage or placeholder
  const getImageUrl = () => {
    if (product.image_url) {
      return `${API_BASE_URL}${product.image_url}`
    }
    return null
  }

  const imageUrl = getImageUrl()

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div 
          className="product-image-placeholder" 
          style={{ 
            display: imageUrl ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '0.875rem',
            textAlign: 'center',
            padding: '1rem'
          }}
        >
          No image uploaded yet
        </div>
        <div className="product-overlay">
          <span className="view-details-btn">View Details</span>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-shg-badge">
          <span className="shg-icon">🏛</span>
          <span className="shg-name">{product.shg?.name || 'N/A'}</span>
        </div>
        
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-meta">
          <span className="product-category">
            {product.category?.name || 'Uncategorized'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
