import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '@components/product/ProductCard'
import productsHero0 from '@/Images/Products.png'
import productsHero1 from '@/Images/Products1.png'
import productsHero2 from '@/Images/Products2.png'
import './ProductsPage.css'

import { API_BASE_URL } from '@utils/api'
const PRODUCTS_PER_PAGE = 15

/** Products1 (was 3rd) → Products2 → Products.png (was 1st) */
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

  // Read category from URL on component mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
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
                    <ProductCard key={product.id} product={product} />
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
    </div>
  )
}

export default ProductsPage
