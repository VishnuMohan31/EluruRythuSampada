import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import Button from '@components/common/Button'
import CustomSelect from '@components/common/CustomSelect'
import { api, logger, showToast } from '@/utils/api'
import '../admin/Dashboard.css'

const ManageSHGs = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('SHG') // 'SHG' or 'Farmer'
  const [editingSHG, setEditingSHG] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('') // New: Type filter
  const [shgs, setSHGs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'SHG',
    name: '', // SHG Group Name or Farmer Name
    contactPerson: '', // Only for SHG
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
      logger.info('Fetching SHGs/Farmers', 'include_inactive=true')
      
      const data = await api.get('/api/shgs/?include_inactive=true')
      logger.success('Fetched SHGs/Farmers', `${data.length} records`)
      
      // Map backend data to frontend format
      const mappedData = data.map(shg => ({
        id: shg.id,
        type: shg.type || 'SHG',
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
      logger.error('Fetch SHGs/Farmers Failed', error.message)
      showToast('Failed to load SHGs/Farmers', 'error')
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
      (shg.village && shg.village.toLowerCase().includes(search)) ||
      (shg.type && shg.type.toLowerCase().includes(search))
    const effectiveStatus = shg.status || 'Active'
    const matchesStatus = !statusFilter || effectiveStatus === statusFilter
    const matchesType = !typeFilter || shg.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setTypeFilter('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Mobile number validation
    if (name === 'mobileNumber') {
      const cleanedValue = value.replace(/[^\d+\s-]/g, '')
      setFormData(prev => ({ ...prev, [name]: cleanedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validatePhoneNumber = (phone) => {
    // Extract only digits
    const digits = phone.replace(/\D/g, '')
    // Check if it's exactly 10 digits
    return digits.length === 10
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate phone number has exactly 10 digits
    if (!validatePhoneNumber(formData.mobileNumber)) {
      showToast('Mobile number must be 10 digits', 'error')
      return
    }

    try {
      const shgData = {
        type: formData.type,
        name: formData.name,
        contact_person: formData.type === 'Farmer' ? formData.name : formData.contactPerson, // For Farmer, use name as contact_person
        mobile_number: formData.mobileNumber,
        mandal: formData.mandal,
        village: formData.village,
        description: formData.description
        // state and district will be auto-filled by backend from logged-in super admin
      }
      
      if (editingSHG) {
        // Update existing SHG/Farmer
        logger.info(`Updating ${formData.type}`, editingSHG.id)
        const updated = await api.put(`/api/shgs/${editingSHG.id}`, shgData)
        logger.success(`${formData.type} Updated`, updated)
        
        showToast(`${formData.type} updated successfully!`, 'success')
        fetchSHGs()
      } else {
        // Add new SHG/Farmer
        logger.info(`Creating ${formData.type}`, formData.name)
        const created = await api.post('/api/shgs/', shgData)
        logger.success(`${formData.type} Created`, created)
        
        showToast(`${formData.type} added successfully!`, 'success')
        fetchSHGs()
      }
      
      closeModal()
    } catch (error) {
      logger.error(`Save ${formData.type} Failed`, error.message)
      showToast(`Failed to save ${formData.type}`, 'error')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSHG(null)
    setModalType('SHG')
    setFormData({
      type: 'SHG',
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
    setModalType(shg.type || 'SHG')
    setFormData({
      type: shg.type || 'SHG',
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

  const handleAddSHG = () => {
    setModalType('SHG')
    setFormData(prev => ({ ...prev, type: 'SHG' }))
    setShowModal(true)
  }

  const handleAddFarmer = () => {
    setModalType('Farmer')
    setFormData(prev => ({ ...prev, type: 'Farmer' }))
    setShowModal(true)
  }

  const handleDeactivate = async (shgId, type) => {
    if (!window.confirm(`Are you sure you want to deactivate this ${type}?`)) return
    
    try {
      logger.info(`Deactivating ${type}`, shgId)
      await api.put(`/api/shgs/${shgId}/deactivate`)
      logger.success(`${type} Deactivated`, shgId)
      
      setSHGs(prev => prev.map(shg => 
        shg.id === shgId ? { ...shg, status: 'Inactive' } : shg
      ))
      showToast(`${type} deactivated successfully!`, 'success')
    } catch (error) {
      logger.error(`Deactivate ${type} Failed`, error.message)
      showToast(`Failed to deactivate ${type}`, 'error')
    }
  }

  const handleReactivate = async (shgId, type) => {
    if (!window.confirm(`Are you sure you want to reactivate this ${type}?`)) return
    
    try {
      logger.info(`Reactivating ${type}`, shgId)
      await api.put(`/api/shgs/${shgId}/reactivate`)
      logger.success(`${type} Reactivated`, shgId)
      
      setSHGs(prev => prev.map(shg => 
        shg.id === shgId ? { ...shg, status: 'Active' } : shg
      ))
      showToast(`${type} reactivated successfully!`, 'success')
    } catch (error) {
      logger.error(`Reactivate ${type} Failed`, error.message)
      showToast(`Failed to reactivate ${type}`, 'error')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage SHGs / Farmers</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" onClick={handleAddSHG}>
            + Add SHG
          </Button>
          <Button variant="primary" onClick={handleAddFarmer}>
            + Add Farmer
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '1rem', alignItems: 'end' }}>
          {/* Search - Takes remaining space */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by ID, Name, Contact Person, Mobile, Mandal, Village, or Type..."
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

          {/* Type Filter - Fixed width */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Type
            </label>
            <CustomSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'SHG', label: 'SHG' },
                { value: 'Farmer', label: 'Farmer' }
              ]}
              placeholder="All Types"
            />
          </div>

          {/* Status Filter - Fixed width */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Status
            </label>
            <CustomSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
              placeholder="All Status"
            />
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
          <table className="data-table" style={{ minWidth: '1100px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '90px' }}>Type</th>
                <th style={{ width: '160px' }}>Name</th>
                <th style={{ width: '140px' }}>Contact Person</th>
                <th style={{ width: '120px' }}>Mobile Number</th>
                <th style={{ width: '110px' }}>Mandal</th>
                <th style={{ width: '110px' }}>Village</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSHGs.length > 0 ? (
                filteredSHGs.map(shg => (
                  <tr key={shg.id}>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shg.id}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span className={`status-badge ${shg.type === 'SHG' ? 'active' : 'pending'}`}>
                        {shg.type || 'SHG'}
                      </span>
                    </td>
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
                            onClick={() => handleDeactivate(shg.id, shg.type)}
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button 
                            className="action-icon-btn reactivate" 
                            title="Reactivate"
                            onClick={() => handleReactivate(shg.id, shg.type)}
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
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    No SHGs/Farmers found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit SHG/Farmer Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '6rem', paddingBottom: '3rem', alignItems: 'flex-start', overflowY: 'auto' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingSHG ? `Edit ${modalType}` : `Add New ${modalType}`}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Name Field - Label changes based on type */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    {modalType === 'Farmer' ? 'Farmer Name' : 'SHG Name'} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={modalType === 'Farmer' ? 'Enter farmer name' : 'Enter SHG name'}
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

                {/* Contact Person - Only show for SHG type */}
                {modalType === 'SHG' && (
                  <div style={{ gridColumn: '1 / -1' }}>
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
                )}

                {/* Mobile Number */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mobile Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    minLength="10"
                    maxLength="10"
                    title="Mobile number must be 10 digits"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                  {formData.mobileNumber && !validatePhoneNumber(formData.mobileNumber) && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      Mobile number must be 10 digits
                    </small>
                  )}
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
                    placeholder={`Enter ${modalType.toLowerCase()} description`}
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
                  {editingSHG ? `Update ${modalType}` : `Add ${modalType}`}
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
