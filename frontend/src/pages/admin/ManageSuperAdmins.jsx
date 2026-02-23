import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react'
import Button from '@components/common/Button'
import { api, logger, showToast } from '@/utils/api'
import './Dashboard.css'

const ManageSuperAdmins = () => {
  const [stateFilter, setStateFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [superAdmins, setSuperAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Fetch super admins from API
  useEffect(() => {
    fetchSuperAdmins()
  }, [])

  const fetchSuperAdmins = async () => {
    try {
      setLoading(true)
      logger.info('Fetching Super Admins', 'role=super_admin')
      
      const data = await api.get('/api/users?role=super_admin')
      logger.success('Fetched Super Admins', `${data.length} users`)
      
      setSuperAdmins(data)
    } catch (error) {
      logger.error('Fetch Super Admins Failed', error.message)
      setSuperAdmins([])
    } finally {
      setLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    state: '',
    district: '',
    password: '',
    confirmPassword: ''
  })

  const stateDistrictMap = {
    'Andhra Pradesh': [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
      'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
      'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam',
      'Prakasam', 'SPSR Nellore', 'Sri Sathya Sai', 'Srikakulam',
      'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR'
    ],
    'Telangana': [
      'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
      'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
      'Khammam', 'Komaram Bheem', 'Mahabubabad', 'Mahbubnagar', 'Mancherial',
      'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
      'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
      'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
      'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'
    ]
  }

  // Get districts for selected state in form
  const availableDistricts = formData.state ? stateDistrictMap[formData.state] || [] : []

  // Get districts for filter
  const filterAvailableDistricts = stateFilter ? stateDistrictMap[stateFilter] || [] : []

  // Filter logic
  const filteredAdmins = superAdmins.filter(admin => {
    const matchesSearch = 
      (admin.full_name && admin.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (admin.email && admin.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (admin.mobile_number && admin.mobile_number.includes(searchQuery)) ||
      (admin.id && admin.id.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesState = !stateFilter || (admin.state && admin.state === stateFilter)
    const matchesDistrict = !districtFilter || (admin.district && admin.district === districtFilter)
    const matchesStatus = !statusFilter || admin.status === statusFilter
    
    return matchesSearch && matchesState && matchesDistrict && matchesStatus
  })

  const clearFilters = () => {
    setStateFilter('')
    setDistrictFilter('')
    setStatusFilter('')
    setSearchQuery('')
  }

  // Reset district filter when state filter changes
  const handleStateFilterChange = (value) => {
    setStateFilter(value)
    setDistrictFilter('') // Reset district when state changes
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      // Mobile number validation
      if (name === 'mobile') {
        const cleanedValue = value.replace(/[^\d+\s-]/g, '')
        return { ...prev, [name]: cleanedValue }
      }
      // If state changes, reset district
      if (name === 'state') {
        return { ...prev, [name]: value, district: '' }
      }
      return { ...prev, [name]: value }
    })
  }

  const validatePhoneNumber = (phone) => {
    // Extract only digits
    const digits = phone.replace(/\D/g, '')
    // Check if it's exactly 10 digits
    return digits.length === 10
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match!', 'error')
      return
    }

    // Validate phone number has exactly 10 digits
    if (!validatePhoneNumber(formData.mobile)) {
      showToast('Mobile number must be 10 digits', 'error')
      return
    }

    try {
      if (editingAdmin) {
        // Update existing admin
        logger.info('Updating Super Admin', editingAdmin.id)
        
        const updateData = {
          full_name: formData.full_name,
          email: formData.email,
          mobile_number: formData.mobile,
          state: formData.state,
          district: formData.district
        }
        
        if (formData.password) {
          updateData.password = formData.password
        }

        const updatedUser = await api.put(`/api/users/${editingAdmin.id}`, updateData)
        logger.success('Super Admin Updated', updatedUser)
        
        showToast('Super Admin updated successfully!', 'success')
        fetchSuperAdmins()
      } else {
        // Add new admin
        logger.info('Creating Super Admin', formData.email)
        
        const createData = {
          full_name: formData.full_name,
          email: formData.email,
          mobile_number: formData.mobile,
          state: formData.state,
          district: formData.district,
          password: formData.password,
          role: 'super_admin'
        }

        const newUser = await api.post('/api/users/', createData)
        logger.success('Super Admin Created', newUser)
        
        showToast('Super Admin added successfully!', 'success')
        fetchSuperAdmins()
      }
      
      closeModal()
    } catch (error) {
      logger.error('Save Super Admin Failed', error.message)
      showToast(error.message || 'Failed to save super admin', 'error')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAdmin(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setFormData({
      full_name: '',
      email: '',
      mobile: '',
      state: '',
      district: '',
      password: '',
      confirmPassword: ''
    })
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData({
      full_name: admin.full_name,
      email: admin.email,
      mobile: admin.mobile_number || admin.mobile || '',
      state: admin.state || '',
      district: admin.district || '',
      password: '',
      confirmPassword: ''
    })
    setShowModal(true)
  }

  const handleDeactivate = async (adminId) => {
    if (window.confirm('Are you sure you want to deactivate this Super Admin?')) {
      try {
        logger.info('Deactivating Super Admin', adminId)
        await api.put(`/api/users/${adminId}/deactivate`)
        logger.success('Super Admin Deactivated', adminId)
        
        showToast('Super Admin deactivated successfully!', 'success')
        fetchSuperAdmins()
      } catch (error) {
        logger.error('Deactivate Super Admin Failed', error.message)
        showToast('Failed to deactivate super admin', 'error')
      }
    }
  }

  const handleReactivate = async (adminId) => {
    if (window.confirm('Are you sure you want to reactivate this Super Admin?')) {
      try {
        logger.info('Reactivating Super Admin', adminId)
        await api.put(`/api/users/${adminId}/reactivate`)
        logger.success('Super Admin Reactivated', adminId)
        
        showToast('Super Admin reactivated successfully!', 'success')
        fetchSuperAdmins()
      } catch (error) {
        logger.error('Reactivate Super Admin Failed', error.message)
        showToast('Failed to reactivate super admin', 'error')
      }
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Super Admins</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Super Admin
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
              placeholder="Search by name, email, mobile, or ID..."
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

          {/* State Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => handleStateFilterChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All States</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          {/* District Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              District
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              disabled={!stateFilter}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)',
                opacity: !stateFilter ? 0.6 : 1,
                cursor: !stateFilter ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">All Districts</option>
              {filterAvailableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters Button - Always visible */}
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
          <table className="data-table" style={{ minWidth: '1100px', width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '150px' }}>Name</th>
                <th style={{ width: '200px' }}>Email</th>
                <th style={{ width: '140px' }}>Mobile</th>
                <th style={{ width: '150px' }}>State</th>
                <th style={{ width: '150px' }}>District</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    Loading super admins...
                  </td>
                </tr>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map(admin => (
                  <tr key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.full_name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.mobile_number || admin.mobile}</td>
                    <td>{admin.state}</td>
                    <td>{admin.district}</td>
                    <td>
                      <span className={`status-badge ${(admin.is_active ? 'active' : 'inactive')}`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-icon-btn edit" 
                          title="Edit"
                          onClick={() => handleEdit(admin)}
                        >
                          <Edit2 size={18} />
                        </button>
                        {admin.is_active ? (
                          <button 
                            className="action-icon-btn delete" 
                            title="Deactivate"
                            onClick={() => handleDeactivate(admin.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button 
                            className="action-icon-btn reactivate" 
                            title="Reactivate"
                            onClick={() => handleReactivate(admin.id)}
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
                    {localStorage.getItem('authToken') 
                      ? 'No super admins found matching your filters' 
                      : 'Please log in to view super admins'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Super Admin Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '4rem', paddingBottom: '2rem', alignItems: 'flex-start' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px', margin: 'auto' }}>
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingAdmin ? 'Edit Super Admin' : 'Add New Super Admin'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Full Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Full Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
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

                {/* State */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    State <span style={{ color: 'red' }}>*</span>
                    {editingAdmin && <span style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Locked)</span>}
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    disabled={editingAdmin}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: editingAdmin ? '#f3f4f6' : 'var(--color-surface)',
                      cursor: editingAdmin ? 'not-allowed' : 'pointer',
                      opacity: editingAdmin ? 0.7 : 1
                    }}
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                  {editingAdmin && (
                    <small style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      State cannot be changed after creation
                    </small>
                  )}
                </div>

                {/* District */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    District <span style={{ color: 'red' }}>*</span>
                    {editingAdmin && <span style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Locked)</span>}
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={!formData.state || editingAdmin}
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: editingAdmin ? '#f3f4f6' : 'var(--color-surface)',
                      opacity: (!formData.state || editingAdmin) ? 0.7 : 1,
                      cursor: (!formData.state || editingAdmin) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {editingAdmin && (
                    <small style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      District cannot be changed after creation
                    </small>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
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

                {/* Mobile */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mobile Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
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
                  {formData.mobile && !validatePhoneNumber(formData.mobile) && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      Mobile number must be 10 digits
                    </small>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Password {!editingAdmin && <span style={{ color: 'red' }}>*</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={editingAdmin ? 'Leave blank to keep current' : 'Enter password'}
                      required={!editingAdmin}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        paddingRight: '2.5rem',
                        border: '2px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-text-light)'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Confirm Password {!editingAdmin && <span style={{ color: 'red' }}>*</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={editingAdmin ? 'Leave blank to keep current' : 'Re-enter password'}
                      required={!editingAdmin}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        paddingRight: '2.5rem',
                        border: '2px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-text-light)'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingAdmin ? 'Update Super Admin' : 'Add Super Admin'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSuperAdmins
