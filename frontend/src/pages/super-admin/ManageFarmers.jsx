import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import Button from '@components/common/Button'
import CustomSelect from '@components/common/CustomSelect'
import { api, logger, showToast, API_BASE_URL } from '@/utils/api'
import '../admin/Dashboard.css'

const ManageFarmers = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingFarmer, setEditingFarmer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mandalFilter, setMandalFilter] = useState('')
  const [villageFilter, setVillageFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 50
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Location dropdowns state (shared between filter and modal)
  const [mandals, setMandals] = useState([])
  const [villages, setVillages] = useState([])           // for modal form
  const [filterVillages, setFilterVillages] = useState([]) // for filter dropdown
  const [loadingMandals, setLoadingMandals] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)
  
  const [formData, setFormData] = useState({
    type: 'Farmer',
    name: '',
    mobileNumber: '',
    whatsappNumber: '',
    sameAsMobile: false,  // Checkbox state
    mandal: '',
    village: '',
    status: 'Active',
    description: '',
    photo: null,
    photoPreview: null
  })

  // Fetch Farmers from API
  useEffect(() => {
    fetchFarmers()
    fetchMandals() // load mandals for filter on page load
  }, [])

  // Fetch mandals when modal opens (already loaded, but ensures fresh data)
  useEffect(() => {
    if (showModal) {
      fetchMandals()
    }
  }, [showModal])

  // Fetch villages for modal form when formData.mandal changes
  useEffect(() => {
    if (formData.mandal) {
      fetchVillages(formData.mandal)
    } else {
      setVillages([])
      setFormData(prev => ({ ...prev, village: '' }))
    }
  }, [formData.mandal])

  // Fetch villages for filter when mandalFilter changes
  useEffect(() => {
    if (mandalFilter) {
      fetchFilterVillages(mandalFilter)
    } else {
      setFilterVillages([])
      setVillageFilter('')
    }
  }, [mandalFilter])

  const fetchMandals = async () => {
    try {
      setLoadingMandals(true)
      logger.info('Fetching Mandals', 'from locations API')
      const data = await api.get('/api/locations/mandals')
      setMandals(data.mandals || [])
      logger.success('Fetched Mandals', `${data.mandals?.length || 0} mandals`)
    } catch (error) {
      logger.error('Fetch Mandals Failed', error.message)
      showToast('Failed to load mandals', 'error')
      setMandals([])
    } finally {
      setLoadingMandals(false)
    }
  }

  const fetchVillages = async (mandal) => {
    try {
      setLoadingVillages(true)
      logger.info('Fetching Villages', `for mandal: ${mandal}`)
      const data = await api.get(`/api/locations/villages?mandal=${encodeURIComponent(mandal)}`)
      setVillages(data.villages || [])
      logger.success('Fetched Villages', `${data.villages?.length || 0} villages`)
    } catch (error) {
      logger.error('Fetch Villages Failed', error.message)
      showToast('Failed to load villages', 'error')
      setVillages([])
    } finally {
      setLoadingVillages(false)
    }
  }

  const fetchFilterVillages = async (mandal) => {
    try {
      const data = await api.get(`/api/locations/villages?mandal=${encodeURIComponent(mandal)}`)
      setFilterVillages(data.villages || [])
    } catch (error) {
      setFilterVillages([])
    }
  }
  const fetchFarmers = async () => {
    try {
      setLoading(true)
      logger.info('Fetching Farmers', 'include_inactive=true')
      
      const data = await api.get('/api/farmers/?include_inactive=true')
      logger.success('Fetched Farmers', `${data.length} records`)
      
      // Map backend data to frontend format
      const mappedData = data.map(farmer => ({
        id: farmer.id,
        type: farmer.type || 'Farmer',
        name: farmer.name,
        mobileNumber: farmer.mobile_number,
        whatsappNumber: farmer.whatsapp_number || '',
        mandal: farmer.mandal,
        village: farmer.village,
        description: farmer.description || '',
        farmerImage: farmer.farmer_image || null,
        status: farmer.is_active ? 'Active' : 'Inactive'
      }))
      setFarmers(mappedData)
    } catch (error) {
      logger.error('Fetch Farmers Failed', error.message)
      showToast('Failed to load Farmers', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Filter logic (treat missing status as 'Active' so filters work with existing data)
  const filteredFarmers = farmers.filter(farmer => {
    const search = (searchQuery || '').trim().toLowerCase()
    const matchesSearch = !search ||
      (farmer.name && farmer.name.toLowerCase().includes(search)) ||
      (farmer.id && farmer.id.toLowerCase().includes(search)) ||
      (farmer.mobileNumber && farmer.mobileNumber.includes(search)) ||
      (farmer.mandal && farmer.mandal.toLowerCase().includes(search)) ||
      (farmer.village && farmer.village.toLowerCase().includes(search))
    const effectiveStatus = farmer.status || 'Active'
    const matchesStatus = !statusFilter || effectiveStatus === statusFilter
    const matchesMandal = !mandalFilter || farmer.mandal === mandalFilter
    const matchesVillage = !villageFilter || farmer.village === villageFilter
    return matchesSearch && matchesStatus && matchesMandal && matchesVillage
  })

  const clearFilters = () => {
    setSearchQuery('')
    setMandalFilter('')
    setVillageFilter('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, mandalFilter, villageFilter, statusFilter])

  const totalPages = Math.ceil(filteredFarmers.length / PAGE_SIZE)
  const paginatedFarmers = filteredFarmers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Handle checkbox for "same as mobile"
    if (name === 'sameAsMobile') {
      setFormData(prev => ({
        ...prev,
        sameAsMobile: checked,
        whatsappNumber: checked ? prev.mobileNumber : ''
      }))
      return
    }
    
    // Mobile number validation
    if (name === 'mobileNumber') {
      const cleanedValue = value.replace(/[^\d+\s-]/g, '')
      setFormData(prev => ({
        ...prev,
        mobileNumber: cleanedValue,
        // Auto-update WhatsApp if checkbox is checked
        whatsappNumber: prev.sameAsMobile ? cleanedValue : prev.whatsappNumber
      }))
    } else if (name === 'whatsappNumber') {
      const cleanedValue = value.replace(/[^\d+\s-]/g, '')
      setFormData(prev => ({ ...prev, whatsappNumber: cleanedValue }))
    } else if (name === 'mandal') {
      // When mandal changes, reset village
      setFormData(prev => ({ ...prev, mandal: value, village: '' }))
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error')
        return
      }
      // Validate file size (max 2MB for Farmer photos)
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be within 2MB', 'error')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent double submission
    if (submitting) return

    // Validate phone number has exactly 10 digits
    if (!validatePhoneNumber(formData.mobileNumber)) {
      showToast('Mobile number must be 10 digits', 'error')
      return
    }

    setSubmitting(true)
    try {
      let farmerImageUrl = formData.photoPreview

      // Upload photo if new file selected
      if (formData.photo) {
        logger.info('Uploading Farmer Photo', formData.photo.name)
        const photoFormData = new FormData()
        photoFormData.append('file', formData.photo)
        
        const uploadData = await api.post('/api/farmers/upload-image', photoFormData)
        farmerImageUrl = uploadData.image_url
        logger.success('Photo Uploaded', farmerImageUrl)
      } else if (farmerImageUrl && farmerImageUrl.startsWith('http')) {
        // Strip API_BASE_URL from existing image URL to get relative path
        farmerImageUrl = farmerImageUrl.replace(API_BASE_URL, '')
      }

      const farmerData = {
        type: 'FARMER',
        name: formData.name,
        mobile_number: formData.mobileNumber,
        whatsapp_number: formData.whatsappNumber || null,
        mandal: formData.mandal,
        village: String(formData.village || ''),
        description: formData.description || '',
        farmer_image: farmerImageUrl || null
      }
      
      if (editingFarmer) {
        // Update existing Farmer
        logger.info('Updating Farmer', editingFarmer.id)
        const updated = await api.put(`/api/farmers/${editingFarmer.id}`, farmerData)
        logger.success('Farmer Updated', updated)
        
        showToast('Farmer updated successfully!', 'success')
        fetchFarmers()
      } else {
        // Add new Farmer
        logger.info('Creating Farmer', formData.name)
        const created = await api.post('/api/farmers/', farmerData)
        logger.success('Farmer Created', created)
        
        showToast('Farmer added successfully!', 'success')
        fetchFarmers()
      }
      
      closeModal()
    } catch (error) {
      logger.error('Save Farmer Failed', error.message)
      showToast('Failed to save Farmer', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingFarmer(null)
    setMandals([])
    setVillages([])
    setFormData({
      type: 'Farmer',
      name: '',
      mobileNumber: '',
      whatsappNumber: '',
      sameAsMobile: false,
      mandal: '',
      village: '',
      status: 'Active',
      description: '',
      photo: null,
      photoPreview: null
    })
  }

  const handleEdit = (farmer) => {
    setEditingFarmer(farmer)
    const sameNumber = farmer.whatsappNumber === farmer.mobileNumber
    const imagePreview = farmer.farmerImage ? `${API_BASE_URL}${farmer.farmerImage}` : null
    
    const newFormData = {
      type: 'Farmer',
      name: farmer.name || '',
      mobileNumber: farmer.mobileNumber || '',
      whatsappNumber: farmer.whatsappNumber || '',
      sameAsMobile: sameNumber,
      mandal: farmer.mandal || '',
      village: farmer.village || '',
      status: farmer.status || 'Active',
      description: farmer.description || '',
      photo: null,
      photoPreview: imagePreview
    }
    
    setFormData(newFormData)
    setShowModal(true)
  }

  const handleAddFarmer = () => {
    setShowModal(true)
  }

  const handleDeactivate = async (farmerId) => {
    if (!window.confirm('Are you sure you want to deactivate this Farmer?')) return
    
    try {
      logger.info('Deactivating Farmer', farmerId)
      await api.put(`/api/farmers/${farmerId}/deactivate`)
      logger.success('Farmer Deactivated', farmerId)
      
      setFarmers(prev => prev.map(farmer => 
        farmer.id === farmerId ? { ...farmer, status: 'Inactive' } : farmer
      ))
      showToast('Farmer deactivated successfully!', 'success')
    } catch (error) {
      logger.error('Deactivate Farmer Failed', error.message)
      showToast('Failed to deactivate Farmer', 'error')
    }
  }

  const handleReactivate = async (farmerId) => {
    if (!window.confirm('Are you sure you want to reactivate this Farmer?')) return
    
    try {
      logger.info('Reactivating Farmer', farmerId)
      await api.put(`/api/farmers/${farmerId}/reactivate`)
      logger.success('Farmer Reactivated', farmerId)
      
      setFarmers(prev => prev.map(farmer => 
        farmer.id === farmerId ? { ...farmer, status: 'Active' } : farmer
      ))
      showToast('Farmer reactivated successfully!', 'success')
    } catch (error) {
      logger.error('Reactivate Farmer Failed', error.message)
      showToast('Failed to reactivate Farmer', 'error')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Farmers</h1>
        <Button variant="primary" onClick={handleAddFarmer}>
          + Add Farmer
        </Button>
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
              placeholder="Search by ID, Name, Mobile, Mandal, or Village..."
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

          {/* Mandal Filter */}
          <div style={{ minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Mandal
            </label>
            <CustomSelect
              value={mandalFilter}
              onChange={(e) => {
                setMandalFilter(e.target.value)
                setVillageFilter('')
              }}
              options={[
                { value: '', label: loadingMandals ? 'Loading...' : 'All Mandals' },
                ...mandals.map(m => ({ value: m, label: m }))
              ]}
              placeholder="All Mandals"
            />
          </div>

          {/* Village Filter - locked until mandal selected */}
          <div style={{ minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Village
            </label>
            <CustomSelect
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              disabled={!mandalFilter}
              options={[
                { value: '', label: !mandalFilter ? 'Select Mandal first' : 'All Villages' },
                ...filterVillages.map(v => ({ value: v.village, label: v.village }))
              ]}
              placeholder="All Villages"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
          <span>
            Showing {filteredFarmers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredFarmers.length)} of {filteredFarmers.length} farmers
          </span>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>«</button>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>‹</button>
              <span style={{ padding: '0 0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>›</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>»</button>
            </div>
          )}
        </div>
        <div className="dashboard-table-wrapper">
          <table className="data-table" style={{ minWidth: '1100px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '80px' }}>Photo</th>
                <th style={{ width: '200px' }}>Name</th>
                <th style={{ width: '140px' }}>Mobile Number</th>
                <th style={{ width: '130px' }}>Mandal</th>
                <th style={{ width: '130px' }}>Village</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFarmers.length > 0 ? (
                paginatedFarmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{farmer.id}</td>
                    <td>
                      {farmer.farmerImage ? (
                        <img 
                          src={`${API_BASE_URL}${farmer.farmerImage}`}
                          alt={farmer.name}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid var(--color-border)'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: 'var(--color-overlay)', 
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          color: 'var(--color-text-light)'
                        }}>
                          No
                        </div>
                      )}
                    </td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={farmer.name}>{farmer.name || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{farmer.mobileNumber || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={farmer.mandal}>{farmer.mandal || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={farmer.village}>{farmer.village || '-'}</td>
                    <td>
                      <span className={`status-badge ${(farmer.status || 'Active').toLowerCase()}`}>
                        {farmer.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-icon-btn edit" 
                          title="Edit"
                          onClick={() => handleEdit(farmer)}
                        >
                          <Edit2 size={18} />
                        </button>
                        {(farmer.status || 'Active') === 'Active' ? (
                          <button 
                            className="action-icon-btn delete" 
                            title="Deactivate"
                            onClick={() => handleDeactivate(farmer.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button 
                            className="action-icon-btn reactivate" 
                            title="Reactivate"
                            onClick={() => handleReactivate(farmer.id)}
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
                    No Farmers found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>«</button>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) => p === '...'
                ? <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem' }}>…</span>
                : <button key={p} onClick={() => setCurrentPage(p)} style={{ ...pageBtn(false), fontWeight: p === currentPage ? '700' : '400', backgroundColor: p === currentPage ? 'var(--color-primary)' : 'transparent', color: p === currentPage ? 'white' : 'var(--color-text)' }}>{p}</button>
              )
            }
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>›</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>»</button>
          </div>
        )}
      </div>

      {/* Add/Edit Farmer Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '7rem', paddingBottom: '2rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Farmer Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Farmer Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Farmer name"
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
                  <CustomSelect
                    name="mandal"
                    value={formData.mandal}
                    onChange={handleInputChange}
                    required
                    disabled={loadingMandals}
                    options={[
                      { value: '', label: loadingMandals ? 'Loading mandals...' : 'Select mandal' },
                      ...mandals.map(mandal => ({ value: mandal, label: mandal }))
                    ]}
                    placeholder="Select mandal"
                  />
                </div>

                {/* Village */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Village <span style={{ color: 'red' }}>*</span>
                  </label>
                  <CustomSelect
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.mandal || loadingVillages}
                    options={[
                      { 
                        value: '', 
                        label: !formData.mandal 
                          ? 'Select mandal first' 
                          : loadingVillages 
                          ? 'Loading villages...' 
                          : 'Select village'
                      },
                      ...villages.map(village => ({ value: village.village, label: village.village }))
                    ]}
                    placeholder="Select village"
                  />
                </div>

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

                {/* WhatsApp Same as Mobile Checkbox */}
                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      name="sameAsMobile"
                      checked={formData.sameAsMobile}
                      onChange={handleInputChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>WhatsApp number is same as mobile number</span>
                  </label>
                </div>

                {/* WhatsApp Number */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="Enter WhatsApp number"
                    minLength="10"
                    maxLength="10"
                    title="WhatsApp number must be 10 digits"
                    disabled={formData.sameAsMobile}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: formData.sameAsMobile ? '#f3f4f6' : 'white',
                      cursor: formData.sameAsMobile ? 'not-allowed' : 'text'
                    }}
                  />
                  {formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber) && !formData.sameAsMobile && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      WhatsApp number must be 10 digits
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
                    placeholder="Enter Farmer description"
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

                {/* Farmer Photo */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Farmer Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                  {formData.photoPreview && (
                    <div style={{ marginTop: '1rem' }}>
                      <img 
                        src={formData.photoPreview} 
                        alt="Preview" 
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '2px solid var(--color-border)'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingFarmer ? 'Update Farmer' : 'Add Farmer')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const pageBtn = (disabled) => ({
  padding: '0.35rem 0.65rem',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  background: 'transparent',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.4 : 1,
  fontSize: '0.875rem',
  color: 'var(--color-text)'
})

export default ManageFarmers
