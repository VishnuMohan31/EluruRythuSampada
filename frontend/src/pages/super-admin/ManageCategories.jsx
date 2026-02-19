import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import Button from '@components/common/Button'
import '../admin/Dashboard.css'

const ManageCategories = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch categories from API
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/categories?include_inactive=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      // Map backend data to frontend format
      const mappedData = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        status: cat.is_active ? 'Active' : 'Inactive'
      }))
      setCategories(mappedData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (categoryId) => {
    if (!window.confirm('Are you sure you want to deactivate this category?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/categories/${categoryId}/deactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to deactivate category')
      
      setCategories(categories.map(cat => 
        cat.id === categoryId ? { ...cat, status: 'Inactive' } : cat
      ))
      alert('Category deactivated successfully!')
    } catch (error) {
      console.error('Error deactivating category:', error)
      alert('Failed to deactivate category')
    }
  }

  const handleReactivate = async (categoryId) => {
    if (!window.confirm('Are you sure you want to reactivate this category?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/categories/${categoryId}/reactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to reactivate category')
      
      setCategories(categories.map(cat => 
        cat.id === categoryId ? { ...cat, status: 'Active' } : cat
      ))
      alert('Category reactivated successfully!')
    } catch (error) {
      console.error('Error reactivating category:', error)
      alert('Failed to reactivate category')
    }
  }

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
                      <button 
                        className="action-icon-btn" 
                        title="Edit"
                        onClick={() => console.log('Edit', category.id)}
                      >
                        <Edit2 size={16} />
                      </button>
                      {category.status === 'Active' ? (
                        <button 
                          className="action-icon-btn delete" 
                          title="Deactivate"
                          onClick={() => handleDeactivate(category.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button 
                          className="action-icon-btn reactivate" 
                          title="Reactivate"
                          onClick={() => handleReactivate(category.id)}
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
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
