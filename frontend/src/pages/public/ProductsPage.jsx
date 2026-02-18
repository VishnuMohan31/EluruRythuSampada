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
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedMandal, setSelectedMandal] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')
  const [selectedSHG, setSelectedSHG] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Get unique values for filters
  const uniqueDistricts = [...new Set(mockProducts.map(p => p.shg?.district).filter(Boolean))].sort()
  const uniqueMandals = [...new Set(mockProducts.map(p => p.shg?.mandal).filter(Boolean))].sort()
  const uniqueVillages = [...new Set(mockProducts.map(p => p.shg?.village).filter(Boolean))].sort()
  const uniqueSHGs = [...new Set(mockProducts.map(p => p.shg?.name).filter(Boolean))].sort()

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
    const matchesDistrict = !selectedDistrict || product.shg?.district === selectedDistrict
    const matchesMandal = !selectedMandal || product.shg?.mandal === selectedMandal
    const matchesVillage = !selectedVillage || product.shg?.village === selectedVillage
    const matchesSHG = !selectedSHG || product.shg?.name === selectedSHG
    
    return matchesSearch && matchesCategory && matchesDistrict && matchesMandal && matchesVillage && matchesSHG
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDistrict('')
    setSelectedMandal('')
    setSelectedVillage('')
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

        {/* Search and Filters Bar */}
        <div className="search-section">
          <div className="search-filters-row">
            {/* Search Bar */}
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

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="filter-select"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            {/* Mandal Filter */}
            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              className="filter-select"
            >
              <option value="">All Mandals</option>
              {uniqueMandals.map(mandal => (
                <option key={mandal} value={mandal}>{mandal}</option>
              ))}
            </select>

            {/* Village Filter */}
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="filter-select"
            >
              <option value="">All Villages</option>
              {uniqueVillages.map(village => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>

            {/* SHG Filter */}
            <select
              value={selectedSHG}
              onChange={(e) => setSelectedSHG(e.target.value)}
              className="filter-select"
            >
              <option value="">All SHGs</option>
              {uniqueSHGs.map(shg => (
                <option key={shg} value={shg}>{shg}</option>
              ))}
            </select>
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
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {selectedCategory && (
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
