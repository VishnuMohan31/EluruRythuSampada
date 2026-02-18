import { useState } from 'react'
import { useAuth } from '@context/AuthContext'
import Button from '@components/common/Button'
import { mockProducts } from '@/data/mockData'
import '../admin/Dashboard.css'

const ManageProducts = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [shgFilter, setShgFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [products, setProducts] = useState(
    mockProducts.map(product => ({
      ...product,
      state: product.shg?.state || 'Andhra Pradesh',
      district: product.shg?.district || 'Eluru',
      mandal: product.shg?.mandal || 'Eluru',
      village: product.shg?.village || 'Pedavegi',
      shgName: product.shg?.name || 'Gond SHG',
      status: product.status || 'Approved'
    }))
  )

  // Get unique values for filters
  const uniqueCategories = [...new Set(products.map(p => p.category.name))].sort()
  const uniqueSHGs = [...new Set(products.map(p => p.shgName))].sort()

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || product.category.name === categoryFilter
    const matchesSHG = !shgFilter || product.shgName === shgFilter
    const matchesStatus = !statusFilter || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesSHG && matchesStatus
  })

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
    setShgFilter('')
    setStatusFilter('')
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
      alert('Product deleted successfully!')
    }
  }

  const handleToggleStatus = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'Approved' ? 'Pending' : 'Approved' }
        : product
    ))
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Products</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Product
        </Button>
      </div>

      {/* Filters Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '1rem', alignItems: 'end' }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* SHG Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              SHG
            </label>
            <select
              value={shgFilter}
              onChange={(e) => setShgFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All SHGs</option>
              {uniqueSHGs.map(shg => (
                <option key={shg} value={shg}>{shg}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={clearFilters}
            style={{ height: '42px', whiteSpace: 'nowrap' }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-table-wrapper">
          <table className="data-table" style={{ minWidth: '1380px', width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '280px' }}>Name</th>
                <th style={{ width: '140px' }}>Category</th>
                <th style={{ width: '140px' }}>SHG Name</th>
                <th style={{ width: '150px' }}>State</th>
                <th style={{ width: '150px' }}>District</th>
                <th style={{ width: '130px' }}>Mandal</th>
                <th style={{ width: '130px' }}>Village</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category.name}</td>
                    <td>{product.shgName}</td>
                    <td>{product.state}</td>
                    <td>{product.district}</td>
                    <td>{product.mandal}</td>
                    <td>{product.village}</td>
                    <td>
                      <span className={`status-badge ${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-icon" 
                          title="Edit"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-icon" 
                          title={product.status === 'Approved' ? 'Mark Pending' : 'Approve'}
                          onClick={() => handleToggleStatus(product.id)}
                        >
                          {product.status === 'Approved' ? '⏸️' : '✅'}
                        </button>
                        <button 
                          className="action-icon" 
                          title="Delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    No products found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageProducts
