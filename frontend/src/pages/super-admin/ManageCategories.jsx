import { useState } from 'react'
import Button from '@components/common/Button'
import { mockCategories } from '@/data/mockData'
import '../admin/Dashboard.css'

const ManageCategories = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categories] = useState(mockCategories.map(cat => ({
    ...cat,
    status: 'Active' // Add status to categories
  })))

  // Filter logic
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = !statusFilter || category.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Categories</h1>
        <Button variant="primary">+ Add Category</Button>
      </div>

      {/* Filters Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'end' }}>
          {/* Search - Takes remaining space */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, ID, or description..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
          <table className="data-table" style={{ minWidth: '800px', width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '180px' }}>Category Type</th>
                <th>Description</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '110px' }}>Actions</th>
              </tr>
            </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <span className={`status-badge ${category.status.toLowerCase()}`}>
                      {category.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-icon" title="Edit">✏️</button>
                      <button className="action-icon" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                  No categories found matching your filters
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

export default ManageCategories
