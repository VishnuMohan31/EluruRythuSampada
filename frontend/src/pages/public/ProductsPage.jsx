import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '@components/product/ProductCard'
import CustomSelect from '@components/common/CustomSelect'
import productsHeaderBg from '@/Images/Products.png'
import './ProductsPage.css'

import { API_BASE_URL } from '@utils/api'
const PRODUCTS_PER_PAGE = 15

const ProductsPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedMandal, setSelectedMandal] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')
  const [selectedFarmer, setSelectedSHG] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
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

  // Get unique values for filters from real data
  const uniqueDistricts = [...new Set(products.map(p => p.farmer?.district).filter(Boolean))].sort()
  const uniqueMandals = [...new Set(products.map(p => p.farmer?.mandal).filter(Boolean))].sort()
  const uniqueVillages = [...new Set(products.map(p => p.farmer?.village).filter(Boolean))].sort()
  const uniqueFarmers = [...new Set(products.map(p => p.farmer?.name).filter(Boolean))].sort()

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
    const matchesDistrict = !selectedDistrict || product.farmer?.district === selectedDistrict
    const matchesMandal = !selectedMandal || product.farmer?.mandal === selectedMandal
    const matchesVillage = !selectedVillage || product.farmer?.village === selectedVillage
    const matchesFarmer = !selectedFarmer || product.farmer?.name === selectedFarmer
    
    return matchesSearch && matchesCategory && matchesDistrict && matchesMandal && matchesVillage && matchesFarmer
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedDistrict, selectedMandal, selectedVillage, selectedFarmer])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDistrict('')
    setSelectedMandal('')
    setSelectedVillage('')
    setSelectedSHG('')
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
        {/* Page Header */}
        <div 
          className="page-header"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${productsHeaderBg})`
          }}
        >
          <h1 className="page-title">Discover Farmer Products</h1>
          <p className="page-description">
            Browse our collection of {products.length} fresh farm products from local farmers
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="search-section">
          <div className="search-filters-row">
            {/* Search Bar - full width on mobile */}
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter dropdowns - visible in row on desktop, grid below search on mobile */}
            <div className="filter-buttons-row">
              <CustomSelect
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                options={[
                  { value: '', label: 'All Districts' },
                  ...uniqueDistricts.map(district => ({ value: district, label: district }))
                ]}
                placeholder="All Districts"
              />
              <CustomSelect
                value={selectedMandal}
                onChange={(e) => setSelectedMandal(e.target.value)}
                options={[
                  { value: '', label: 'All Mandals' },
                  ...uniqueMandals.map(mandal => ({ value: mandal, label: mandal }))
                ]}
                placeholder="All Mandals"
              />
              <CustomSelect
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                options={[
                  { value: '', label: 'All Villages' },
                  ...uniqueVillages.map(village => ({ value: village, label: village }))
                ]}
                placeholder="All Villages"
              />
              <CustomSelect
                value={selectedFarmer}
                onChange={(e) => setSelectedSHG(e.target.value)}
                options={[
                  { value: '', label: 'All Farmers' },
                  ...uniqueFarmers.map(farmer => ({ value: farmer, label: farmer }))
                ]}
                placeholder="All Farmers"
              />
            </div>
          </div>

          <button
            className="filter-toggle-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            🎛️ Filters
            {selectedCategory && (
              <span className="filter-badge">1</span>
            )}
          </button>
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
                {(selectedCategory || selectedDistrict || selectedMandal || selectedVillage || selectedFarmer) && (
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
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
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
