import { useState } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import Button from '@components/common/Button'
import './Dashboard.css'

const ManageSuperAdmins = () => {
  const [stateFilter, setStateFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [superAdmins, setSuperAdmins] = useState([
    { 
      id: 'USR002', 
      name: 'John Doe', 
      email: 'john@example.com', 
      mobile: '+91 9876543210',
      state: 'Andhra Pradesh',
      district: 'Eluru',
      status: 'Active' 
    },
    { 
      id: 'USR003', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      mobile: '+91 9123456789',
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      status: 'Active' 
    },
    { 
      id: 'USR004', 
      name: 'Ramesh Kumar', 
      email: 'ramesh@example.com', 
      mobile: '+91 9988776655',
      state: 'Andhra Pradesh',
      district: 'Vijayawada',
      status: 'Active' 
    },
    { 
      id: 'USR005', 
      name: 'Lakshmi Devi', 
      email: 'lakshmi@example.com', 
      mobile: '+91 9876512345',
      state: 'Andhra Pradesh',
      district: 'Eluru',
      status: 'Inactive' 
    },
  ])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    district: '',
    password: '',
    confirmPassword: ''
  })

  const stateDistrictMap = {
    'Andhra Pradesh': [
      'Anantapur', 'Chittoor', 'East Godavari', 'Eluru', 'Guntur', 
      'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 
      'Vizianagaram', 'West Godavari', 'Vijayawada'
    ],
    'Telangana': [
      'Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahbubnagar',
      'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal'
    ]
  }

  // Get districts for selected state in form
  const availableDistricts = formData.state ? stateDistrictMap[formData.state] || [] : []

  // Get districts for filter
  const filterAvailableDistricts = stateFilter ? stateDistrictMap[stateFilter] || [] : []

  // Filter logic
  const filteredAdmins = superAdmins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.mobile.includes(searchQuery) ||
      admin.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesState = !stateFilter || admin.state === stateFilter
    const matchesDistrict = !districtFilter || admin.district === districtFilter
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
      // If state changes, reset district
      if (name === 'state') {
        return { ...prev, [name]: value, district: '' }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (editingAdmin) {
      // Update existing admin
      setSuperAdmins(prev => prev.map(admin => 
        admin.id === editingAdmin.id 
          ? { ...admin, ...formData, id: admin.id } // Keep the same ID
          : admin
      ))
      alert('Super Admin updated successfully!')
    } else {
      // Add new admin
      const newAdmin = {
        id: `USR${String(superAdmins.length + 2).padStart(3, '0')}`,
        ...formData,
        status: 'Active'
      }
      setSuperAdmins(prev => [...prev, newAdmin])
      alert('Super Admin added successfully!')
    }
    
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAdmin(null)
    setFormData({
      name: '',
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
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      state: admin.state,
      district: admin.district,
      password: '',
      confirmPassword: ''
    })
    setShowModal(true)
  }

  const handleDeactivate = (adminId) => {
    if (window.confirm('Are you sure you want to deactivate this Super Admin?')) {
      setSuperAdmins(prev => prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, status: 'Inactive' }
          : admin
      ))
      alert('Super Admin deactivated successfully!')
    }
  }

  const handleReactivate = (adminId) => {
    if (window.confirm('Are you sure you want to reactivate this Super Admin?')) {
      setSuperAdmins(prev => prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, status: 'Active' }
          : admin
      ))
      alert('Super Admin reactivated successfully!')
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
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map(admin => (
                  <tr key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.mobile}</td>
                    <td>{admin.state}</td>
                    <td>{admin.district}</td>
                    <td>
                      <span className={`status-badge ${admin.status.toLowerCase()}`}>
                        {admin.status}
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
                        {admin.status === 'Active' ? (
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
                    No super admins found matching your filters
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
                    name="name"
                    value={formData.name}
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

                {/* State */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    State <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--color-surface)'
                    }}
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    District <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={!formData.state}
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--color-surface)',
                      opacity: !formData.state ? 0.6 : 1,
                      cursor: !formData.state ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Password {!editingAdmin && <span style={{ color: 'red' }}>*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editingAdmin ? 'Leave blank to keep current' : 'Enter password'}
                    required={!editingAdmin}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Confirm Password {!editingAdmin && <span style={{ color: 'red' }}>*</span>}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={editingAdmin ? 'Leave blank to keep current' : 'Re-enter password'}
                    required={!editingAdmin}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
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
