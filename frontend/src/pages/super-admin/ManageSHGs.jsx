import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import Button from '@components/common/Button'
import { api, logger } from '@/utils/api'
import '../admin/Dashboard.css'

const ManageSHGs = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingSHG, setEditingSHG] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [shgs, setSHGs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '', // SHG Group Name (text input)
    contactPerson: '',
    mobileNumber: '',
    mandal: '',
    village: '',
    status: 'Active',
    description: ''
  })

  // Fetch SHGs from API
  useEffect(() => {
    fetchSHGs()
  }, [])

  const fetchSHGs = async () => {
    try {
      setLoading(true)
      logger.info('Fetching SHGs', 'include_inactive=true')
      
      const data = await api.get('/api/shgs?include_inactive=true')
      logger.success('Fetched SHGs', `${data.length} SHGs`)
      
      // Map backend data to frontend format
      const mappedData = data.map(shg => ({
        id: shg.id,
        name: shg.name,
        contactPerson: shg.contact_person,
        mobileNumber: shg.mobile_number,
        mandal: shg.mandal,
        village: shg.village,
        description: shg.description || '',
        status: shg.is_active ? 'Active' : 'Inactive'
      }))
      setSHGs(mappedData)
    } catch (error) {
      logger.error('Fetch SHGs Failed', error.message)
      alert('Failed to load SHGs')
    } finally {
      setLoading(false)
    }
  }

  // Filter logic (treat missing status as 'Active' so filters work with existing data)
  const filteredSHGs = shgs.filter(shg => {
    const search = (searchQuery || '').trim().toLowerCase()
    const matchesSearch = !search ||
      (shg.name && shg.name.toLowerCase().includes(search)) ||
      (shg.id && shg.id.toLowerCase().includes(search)) ||
      (shg.contactPerson && shg.contactPerson.toLowerCase().includes(search)) ||
      (shg.mobileNumber && shg.mobileNumber.includes(search)) ||
      (shg.mandal && shg.mandal.toLowerCase().includes(search)) ||
      (shg.village && shg.village.toLowerCase().includes(search))
    const effectiveStatus = shg.status || 'Active'
    const matchesStatus = !statusFilter || effectiveStatus === statusFilter
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const shgData = {
        name: formData.name,
        contact_person: formData.contactPerson,
        mobile_number: formData.mobileNumber,
        mandal: formData.mandal,
        village: formData.village,
        description: formData.description
        // state and district will be auto-filled by backend from logged-in super admin
      }
      
      if (editingSHG) {
        // Update existing SHG
        logger.info('Updating SHG', editingSHG.id)
        const updated = await api.put(`/api/shgs/${editingSHG.id}`, shgData)
        logger.success('SHG Updated', updated)
        
        alert('SHG updated successfully!')
        fetchSHGs()
      } else {
        // Add new SHG
        logger.info('Creating SHG', formData.name)
        const created = await api.post('/api/shgs/', shgData)
        logger.success('SHG Created', created)
        
        alert('SHG added successfully!')
        fetchSHGs()
      }
      
      closeModal()
    } catch (error) {
      logger.error('Save SHG Failed', error.message)
      alert('Failed to save SHG')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSHG(null)
    setFormData({
      name: '',
      contactPerson: '',
      mobileNumber: '',
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
      contactPerson: shg.contactPerson || '',
      mobileNumber: shg.mobileNumber || '',
      mandal: shg.mandal || '',
      village: shg.village || '',
      status: shg.status || 'Active',
      description: shg.description || ''
    })
    setShowModal(true)
  }

  const handleDeactivate = async (shgId) => {
    if (!window.confirm('Are you sure you want to deactivate this SHG?')) return
    
    try {
      logger.info('Deactivating SHG', shgId)
      await api.put(`/api/shgs/${shgId}/deactivate`)
      logger.success('SHG Deactivated', shgId)
      
      setSHGs(prev => prev.map(shg => 
        shg.id === shgId ? { ...shg, status: 'Inactive' } : shg
      ))
      alert('SHG deactivated successfully!')
    } catch (error) {
      logger.error('Deactivate SHG Failed', error.message)
      alert('Failed to deactivate SHG')
    }
  }

  const handleReactivate = async (shgId) => {
    if (!window.confirm('Are you sure you want to reactivate this SHG?')) return
    
    try {
      logger.info('Reactivating SHG', shgId)
      await api.put(`/api/shgs/${shgId}/reactivate`)
      logger.success('SHG Reactivated', shgId)
      
      setSHGs(prev => prev.map(shg => 
        shg.id === shgId ? { ...shg, status: 'Active' } : shg
      ))
      alert('SHG reactivated successfully!')
    } catch (error) {
      logger.error('Reactivate SHG Failed', error.message)
      alert('Failed to reactivate SHG')
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

      {/* Filters Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'end' }}>
          {/* Search - Takes remaining space */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by ID, SHG Name, Contact Person, Mobile, Mandal, or Village..."
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

          {/* Status Filter - Fixed width */}
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

          {/* Clear Filters Button - Auto width */}
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
          <table className="data-table" style={{ minWidth: '1000px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '180px' }}>SHG Name</th>
                <th style={{ width: '150px' }}>Contact Person</th>
                <th style={{ width: '130px' }}>Mobile Number</th>
                <th style={{ width: '120px' }}>Mandal</th>
                <th style={{ width: '120px' }}>Village</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSHGs.length > 0 ? (
                filteredSHGs.map(shg => (
                  <tr key={shg.id}>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shg.id}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shg.name}>{shg.name || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shg.contactPerson}>{shg.contactPerson || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shg.mobileNumber || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shg.mandal}>{shg.mandal || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={shg.village}>{shg.village || '-'}</td>
                    <td>
                      <span className={`status-badge ${(shg.status || 'Active').toLowerCase()}`}>
                        {shg.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-icon-btn edit" 
                          title="Edit"
                          onClick={() => handleEdit(shg)}
                        >
                          <Edit2 size={18} />
                        </button>
                        {(shg.status || 'Active') === 'Active' ? (
                          <button 
                            className="action-icon-btn delete" 
                            title="Deactivate"
                            onClick={() => handleDeactivate(shg.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button 
                            className="action-icon-btn reactivate" 
                            title="Reactivate"
                            onClick={() => handleReactivate(shg.id)}
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    No SHGs found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                {/* SHG Name */}
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

                {/* Contact Person */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Contact Person <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter contact person name"
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

                {/* Mobile Number */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mobile Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
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
