import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '@components/product/ProductCard'
import { mockProducts, mockCategories, mockSHGs } from '@/data/mockData'
import productsHeaderBg from '@/Images/Products.png'
import './ProductsPage.css'

const ProductsPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSHG, setSelectedSHG] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Read category from URL on component mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category.id === selectedCategory
    const matchesSHG = !selectedSHG || product.shg.id === selectedSHG
    
    return matchesSearch && matchesCategory && matchesSHG
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedSHG('')
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
          <h1 className="page-title">Discover SHG Products</h1>
          <p className="page-description">
            Browse our collection of {mockProducts.length} authentic handcrafted products
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
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
          
          <button
            className="filter-toggle-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            🎛️ Filters
            {(selectedCategory || selectedSHG) && (
              <span className="filter-badge">
                {[selectedCategory, selectedSHG].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {(selectedCategory || selectedSHG) && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
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
                {mockCategories.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span>{category.name}</span>
                    <span className="filter-count">({category.productCount})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SHG Filter */}
            <div className="filter-group">
              <h4 className="filter-title">SHG</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="shg"
                    value=""
                    checked={selectedSHG === ''}
                    onChange={(e) => setSelectedSHG(e.target.value)}
                  />
                  <span>All SHGs</span>
                </label>
                {mockSHGs.map(shg => (
                  <label key={shg.id} className="filter-option">
                    <input
                      type="radio"
                      name="shg"
                      value={shg.id}
                      checked={selectedSHG === shg.id}
                      onChange={(e) => setSelectedSHG(e.target.value)}
                    />
                    <span>{shg.name}</span>
                    <span className="filter-state">({shg.state})</span>
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
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
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
