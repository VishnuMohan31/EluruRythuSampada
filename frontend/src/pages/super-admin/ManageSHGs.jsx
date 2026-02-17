import { useState } from 'react'
import { useAuth } from '@context/AuthContext'
import Button from '@components/common/Button'
import { mockSHGs } from '@/data/mockData'
import '../admin/Dashboard.css'

const ManageSHGs = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingSHG, setEditingSHG] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [shgs, setSHGs] = useState(mockSHGs)
  const [formData, setFormData] = useState({
    name: '', // SHG Group Name (text input)
    state: user?.state || 'Andhra Pradesh', // Default from super admin
    district: user?.district || 'Eluru', // Default from super admin
    mandal: '',
    village: '',
    status: 'Active',
    description: ''
  })

  // Remove groupTypes - not needed anymore

  // Filter logic
  const filteredSHGs = shgs.filter(shg => {
    const matchesSearch = 
      shg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shg.mandal && shg.mandal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shg.village && shg.village.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = !statusFilter || shg.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingSHG) {
      // Update existing SHG
      setSHGs(prev => prev.map(shg => 
        shg.id === editingSHG.id 
          ? { ...shg, ...formData, id: shg.id }
          : shg
      ))
      alert('SHG updated successfully!')
    } else {
      // Add new SHG
      const newSHG = {
        id: `SHG${String(shgs.length + 1).padStart(3, '0')}`,
        ...formData
      }
      setSHGs(prev => [...prev, newSHG])
      alert('SHG added successfully!')
    }
    
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSHG(null)
    setFormData({
      name: '',
      state: user?.state || 'Andhra Pradesh',
      district: user?.district || 'Eluru',
      mandal: '',
      village: '',
      status: 'Active',
      description: ''
    })
  }

  const handleEdit = (shg) => {
    setEditingSHG(shg)
    setFormData({
      name: shg.name || '',
      state: shg.state || user?.state || 'Andhra Pradesh',
      district: shg.district || user?.district || 'Eluru',
      mandal: shg.mandal || '',
      village: shg.village || '',
      status: shg.status || 'Active',
      description: shg.description
    })
    setShowModal(true)
  }

  const handleToggleStatus = (shgId) => {
    setSHGs(prev => prev.map(shg => 
      shg.id === shgId 
        ? { ...shg, status: shg.status === 'Active' ? 'Inactive' : 'Active' }
        : shg
    ))
  }

  const handleDelete = (shgId) => {
    if (window.confirm('Are you sure you want to delete this SHG?')) {
      setSHGs(prev => prev.filter(shg => shg.id !== shgId))
      alert('SHG deleted successfully!')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage SHGs</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add SHG
        </Button>
      </div>

      <div className="dashboard-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SHG Name</th>
              <th>State</th>
              <th>District</th>
              <th>Mandal</th>
              <th>Village</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shgs.map(shg => (
              <tr key={shg.id}>
                <td>{shg.id}</td>
                <td>{shg.name || '-'}</td>
                <td>{shg.state}</td>
                <td>{shg.district || '-'}</td>
                <td>{shg.mandal || '-'}</td>
                <td>{shg.village || '-'}</td>
                <td>
                  <span className={`status-badge ${(shg.status || 'Active').toLowerCase()}`}>
                    {shg.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="action-icon" 
                      title="Edit"
                      onClick={() => handleEdit(shg)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-icon" 
                      title={shg.status === 'Active' ? 'Deactivate' : 'Activate'}
                      onClick={() => handleToggleStatus(shg.id)}
                    >
                      {shg.status === 'Active' ? '🔒' : '🔓'}
                    </button>
                    <button 
                      className="action-icon" 
                      title="Delete"
                      onClick={() => handleDelete(shg.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit SHG Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '6rem', paddingBottom: '3rem', alignItems: 'flex-start', overflowY: 'auto' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingSHG ? 'Edit SHG' : 'Add New SHG'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Group Name - Text Input for SHG Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    SHG Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter SHG name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* State - Read-only (from super admin) */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    State <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* District - Read-only (from super admin) */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    District <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Mandal */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mandal <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="mandal"
                    value={formData.mandal}
                    onChange={handleInputChange}
                    placeholder="Enter mandal"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Village */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Village <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="Enter village"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter SHG description"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingSHG ? 'Update SHG' : 'Add SHG'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSHGs
