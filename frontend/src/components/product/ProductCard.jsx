import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '@utils/api'
import './ProductCard.css'

const ProductCard = ({ product, onContact }) => {
  const navigate = useNavigate()

  const getImageUrl = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const mainIndex = product.main_image_index || 0
      const imagePath = product.images[mainIndex]
      return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`
    }
    if (product.image_url) {
      const imagePath = product.image_url
      return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`
    }
    return null
  }

  const imageUrl = getImageUrl()

  const handleCardClick = (e) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    navigate(`/products/${product.id}`)
  }

  const handleContact = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onContact) onContact(product)
  }

  return (
    <div className="product-card">
      {/* Clickable area — image + info → navigates to detail page */}
      <div className="product-card-link" onClick={handleCardClick}>
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
          <div className="product-farmer-badge">
            <span className="farmer-icon">◈</span>
            <span className="farmer-name">{product.farmer?.name || 'N/A'}</span>
          </div>

          <h3 className="product-name">{product.name}</h3>

          <div className="product-meta">
            <span className="product-category">
              {product.category?.name || 'Uncategorized'}
            </span>
          </div>

          {/* Price & Quantity pills */}
          {(product.price || product.max_quantity) && (
            <div className="product-price-row">
              {product.price && (
                <span className="product-price-tag">💰 Price - ₹{product.price}</span>
              )}
              {product.max_quantity && (
                <span className="product-qty-tag">📦 Max Supply - {product.max_quantity}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact button — does NOT navigate */}
      <div className="product-card-footer">
        <button className="product-contact-btn" onClick={handleContact}>
          📞 Contact
        </button>
      </div>
    </div>
  )
}

export default ProductCard
