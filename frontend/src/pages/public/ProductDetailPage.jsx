import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '@components/common/Button'
import { useToast } from '@components/common/ToastContainer'
import './ProductDetailPage.css'

const API_BASE_URL = 'http://localhost:8000'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { showToast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`)
      if (!response.ok) throw new Error('Product not found')
      
      const data = await response.json()
      setProduct(data)
      
      // Fetch related products
      if (data.category_id) {
        fetchRelatedProducts(data.category_id, data.id)
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products?category_id=${categoryId}&limit=4`)
      const data = await response.json()
      setRelatedProducts(data.filter(p => p.id !== currentProductId).slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch related products:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          name: formData.name,
          email: formData.email,
          location: formData.location,
          phone: formData.phone || null
          // ip_address removed - backend will capture it
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to submit inquiry')
      }

      setShowContactModal(false)
      setShowSuccessModal(true)
      setFormData({ name: '', email: '', location: '', phone: '' })
      showToast('Inquiry submitted successfully!', 'success')
    } catch (error) {
      console.error('Failed to submit inquiry:', error)
      showToast(error.message || 'Failed to submit inquiry', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>
  }

  if (!product) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Product not found</div>
  }

  const productImages = product.image_url 
    ? [`${API_BASE_URL}${product.image_url}`] 
    : ['/placeholder-product.jpg']

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
                src={productImages[selectedImage]}
                alt={product.name}
                className="gallery-main-img"
              />
            </div>
            {productImages.length > 1 && (
              <div className="thumbnail-list">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-shg-badge">
              <span className="shg-icon">🏛</span>
              <span>{product.shg?.name || 'N/A'} • {product.shg?.village || ''}, {product.shg?.mandal || ''}</span>
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <span className="meta-item">
                <strong>Category:</strong> {product.category?.name || 'N/A'}
              </span>
              <span className="meta-item">
                <strong>SHG:</strong> {product.shg?.name || 'N/A'}
              </span>
            </div>

            <div className="product-description">
              <h3>About this Product</h3>
              <p>{product.description}</p>
            </div>

            {(product.youtube_link || product.instagram_link) && (
              <div className="product-social">
                <h4>See More</h4>
                <div className="social-links">
                  {product.youtube_link && (
                    <a href={product.youtube_link} target="_blank" rel="noopener noreferrer" className="social-link">
                      📺 Watch Video
                    </a>
                  )}
                  {product.instagram_link && (
                    <a href={product.instagram_link} target="_blank" rel="noopener noreferrer" className="social-link">
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
                  <img 
                    src={relatedProduct.image_url ? `${API_BASE_URL}${relatedProduct.image_url}` : '/placeholder-product.jpg'} 
                    alt={relatedProduct.name} 
                  />
                  <h4>{relatedProduct.name}</h4>
                  <p>{relatedProduct.shg?.name || 'N/A'}</p>
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
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Your city/state" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com" 
                />
              </div>
              <Button variant="primary" size="large" fullWidth type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit & Get Vendor Details'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSuccessModal(false)}>
              ✕
            </button>
            <h2>✅ Inquiry Submitted!</h2>
            <p>Thank you for your interest. Here are the vendor details:</p>
            
            <div className="vendor-details">
              <div className="detail-item">
                <strong>SHG Name:</strong> {product.shg?.name || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Contact Person:</strong> {product.shg?.contact_person || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Mobile:</strong> <a href={`tel:${product.shg?.mobile_number}`}>{product.shg?.mobile_number || 'N/A'}</a>
              </div>
              <div className="detail-item">
                <strong>Location:</strong> {product.shg?.village}, {product.shg?.mandal}
              </div>
            </div>
            
            <Button variant="primary" size="large" fullWidth onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
