import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '@components/product/ProductCard'
import { FaWhatsapp } from 'react-icons/fa'
import productsHero0 from '@/Images/Products.png'
import productsHero1 from '@/Images/Products1.png'
import productsHero2 from '@/Images/Products2.png'
import './ProductsPage.css'

import { API_BASE_URL } from '@utils/api'
const PRODUCTS_PER_PAGE = 15

const HERO_IMAGES = [productsHero1, productsHero2, productsHero0]
const HERO_ROTATE_MS = 3000

const ProductsPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = React.useRef(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Contact modal state
  const [contactProduct, setContactProduct] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successProduct, setSuccessProduct] = useState(null)
  const [contactForm, setContactForm] = useState({ name: '', phone: '', location: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  
  // Data from API
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products and categories from API
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'instant' })
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch products and categories in parallel
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products/`),
        fetch(`${API_BASE_URL}/api/categories/`)
      ])
      
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      
      setProducts(productsData)
      setCategories(categoriesData.filter(cat => cat.is_active))
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Hero carousel: every 3s — Products1 → Products2 → Products.png; text stays fixed
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, HERO_ROTATE_MS)
    return () => clearInterval(timer)
  }, [])

  // Auto-focus input when search expands; Escape to close
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [searchOpen])

  // Read category and search from URL on component mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl)
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
      setSearchOpen(true)
    }
  }, [searchParams])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category?.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setCurrentPage(1)
  }

  // Count products per category
  const getCategoryCount = (categoryId) => {
    return products.filter(p => p.category?.id === categoryId).length
  }

  // Contact modal handlers
  const handleContact = (product) => {
    setContactProduct(product)
    setContactForm({ name: '', phone: '', location: '', email: '' })
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    const digits = contactForm.phone.replace(/\D/g, '')
    if (digits.length !== 10) return
    setSubmitting(true)
    try {
      // Submit inquiry
      const res = await fetch(`${API_BASE_URL}/api/inquiries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: contactProduct.id,
          name: contactForm.name,
          phone: contactForm.phone,
          location: contactForm.location || 'Not specified',
          email: contactForm.email || null
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed')
      }

      // Fetch full product details to get farmer contact info
      const productRes = await fetch(`${API_BASE_URL}/api/products/${contactProduct.id}`)
      const fullProduct = productRes.ok ? await productRes.json() : contactProduct

      setSuccessProduct(fullProduct)
      setContactProduct(null)
      setShowSuccessModal(true)
    } catch (err) {
      alert(err.message || 'Failed to submit inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="container">

        {/* Page Header / Hero carousel (Products1 → Products2 → Products.png) */}
        <div className="page-header">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`hero-slide ${i === heroIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${img})`
              }}
              aria-hidden={i !== heroIndex}
            />
          ))}
          <div className="hero-content">
            <div className="hero-copy">
              <div className="hero-text-stack">
                <h1 className="page-title">Discover Farmer Products</h1>
                <p className="page-description">
                  Browse our collection of {products.length} fresh farm products from local farmers
                </p>
              </div>
            </div>
            <div className="hero-dots">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Hero image ${i + 1} of ${HERO_IMAGES.length}`}
                  aria-current={i === heroIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="products-layout">
          {/* Backdrop overlay for mobile filters */}
          {filtersOpen && (
            <div 
              className="filters-backdrop" 
              onClick={() => setFiltersOpen(false)}
            />
          )}

          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {selectedCategory && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear All
                  </button>
                )}
                <button 
                  className="close-filters-btn" 
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span>{category.name}</span>
                    <span className="filter-count">({getCategoryCount(category.id)})</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Products Grid */}
          <div className="products-content">
            <div className="products-header">
              <p className="products-count">
                Available Products - {filteredProducts.length}
              </p>
              {/* Search icon - expands inline */}
              <div className={`search-bar-expandable ${searchOpen ? 'open' : ''}`}>
                <button
                  className="search-icon-btn"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                >
                  🔍
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-expandable"
                />
                {searchOpen && (
                  <button
                    className="search-close-btn"
                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    aria-label="Close search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="products-grid">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} onContact={handleContact} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          )
                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return <span key={pageNum} className="pagination-ellipsis">...</span>
                        }
                        return null
                      })}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <div className="no-products-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactProduct && (
        <div className="pc-modal-overlay" onClick={() => setContactProduct(null)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <button className="pc-modal-close" onClick={() => setContactProduct(null)}>✕</button>
            <h2>Contact Farmer</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              For: <strong>{contactProduct.name}</strong>
            </p>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Name *</label>
                <input type="text" required placeholder="Your name"
                  value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem', border: '2px solid var(--color-border)', borderRadius: '8px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Phone *</label>
                <input type="tel" required placeholder="10-digit mobile number" maxLength="10"
                  value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                  style={{ width: '100%', padding: '0.625rem', border: '2px solid var(--color-border)', borderRadius: '8px', fontSize: '0.875rem' }} />
                {contactForm.phone && contactForm.phone.replace(/\D/g, '').length !== 10 && (
                  <small style={{ color: '#dc2626', fontSize: '0.75rem' }}>Must be 10 digits</small>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Location</label>
                <input type="text" placeholder="Your city/state"
                  value={contactForm.location} onChange={e => setContactForm(p => ({ ...p, location: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem', border: '2px solid var(--color-border)', borderRadius: '8px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Email (Optional)</label>
                <input type="email" placeholder="your@email.com"
                  value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem', border: '2px solid var(--color-border)', borderRadius: '8px', fontSize: '0.875rem' }} />
              </div>
              <button type="submit" disabled={submitting}
                style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
                {submitting ? 'Submitting...' : 'Submit & Get Farmer Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && successProduct && (
        <div className="pc-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <button className="pc-modal-close" onClick={() => setShowSuccessModal(false)}>✕</button>
            <h2>✅ Inquiry Submitted!</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>Farmer details for <strong>{successProduct.name}</strong>:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <div><strong>Farmer:</strong> {successProduct.farmer?.name || 'N/A'}</div>
              <div><strong>Location:</strong> {successProduct.farmer?.village}, {successProduct.farmer?.mandal}</div>
            </div>
            {successProduct.farmer?.whatsapp_number && (
              <a href={`https://wa.me/91${successProduct.farmer.whatsapp_number}?text=Hi, I'm interested in ${encodeURIComponent(successProduct.name)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#25D366', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', marginBottom: '0.75rem' }}>
                <FaWhatsapp size={20} /> Contact on WhatsApp
              </a>
            )}
            {successProduct.farmer?.mobile_number && (
              <a href={`tel:${successProduct.farmer.mobile_number}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#0891B2', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', marginBottom: '0.75rem' }}>
                📞 Call Farmer
              </a>
            )}
            <button onClick={() => setShowSuccessModal(false)}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
