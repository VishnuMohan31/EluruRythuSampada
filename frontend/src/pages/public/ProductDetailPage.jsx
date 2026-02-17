import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockProducts } from '@/data/mockData'
import Button from '@components/common/Button'
import './ProductDetailPage.css'

const ProductDetailPage = () => {
  const { id } = useParams()
  const product = mockProducts.find(p => p.id === id) || mockProducts[0]
  const [selectedImage, setSelectedImage] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  const relatedProducts = mockProducts
    .filter(p => p.category.id === product.category.id && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-separator">›</span>
          <span>{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="product-detail">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="gallery-main-img"
              />
            </div>
            <div className="thumbnail-list">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-shg-badge">
              <span className="shg-icon">🏛</span>
              <span>{product.shg.name} • {product.shg.state}</span>
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <span className="meta-item">
                <strong>Category:</strong> {product.category.name} › {product.subcategory.name}
              </span>
              <span className="meta-item">
                <strong>Artisan:</strong> {product.vendor.name}
              </span>
              <span className="meta-item">
                <strong>Views:</strong> 👁 {product.viewCount.toLocaleString()}
              </span>
            </div>

            <div className="product-description">
              <h3>About this Product</h3>
              <p>{product.description}</p>
            </div>

            {(product.youtubeLink || product.instagramLink) && (
              <div className="product-social">
                <h4>See More</h4>
                <div className="social-links">
                  {product.youtubeLink && (
                    <a href={product.youtubeLink} target="_blank" rel="noopener noreferrer" className="social-link">
                      📺 Watch Video
                    </a>
                  )}
                  {product.instagramLink && (
                    <a href={product.instagramLink} target="_blank" rel="noopener noreferrer" className="social-link">
                      📷 Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="product-actions">
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={() => setShowContactModal(true)}
              >
                📞 Contact Vendor
              </Button>
              <p className="contact-note">
                Connect directly with the artisan to learn more or place an order
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="section-title">Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="related-card"
                >
                  <img src={relatedProduct.images[0]} alt={relatedProduct.name} />
                  <h4>{relatedProduct.name}</h4>
                  <p>{relatedProduct.shg.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContactModal(false)}>
              ✕
            </button>
            <h2>Contact Vendor</h2>
            <p>To contact the vendor, please provide your details:</p>
            
            <form className="contact-form">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input type="text" placeholder="Your city/state" required />
              </div>
              <div className="form-group">
                <label>Phone (Optional)</label>
                <input type="tel" placeholder="+91 1234567890" />
              </div>
              <div className="form-group">
                <label>CAPTCHA *</label>
                <div className="captcha-placeholder">
                  [CAPTCHA will be integrated]
                </div>
              </div>
              <Button variant="primary" size="large" fullWidth type="submit">
                Submit & Get Vendor Details
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
