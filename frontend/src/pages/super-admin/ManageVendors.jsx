import { useState } from 'react'
import { useAuth } from '@context/AuthContext'
import Button from '@components/common/Button'
import '../admin/Dashboard.css'

const ManageVendors = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [shgFilter, setShgFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vendors, setVendors] = useState([
    { 
      id: 'VND001', 
      name: 'Ramesh Kumar', 
      shgName: 'Gond SHG',
      state: 'Andhra Pradesh',
      district: 'Eluru',
      mandal: 'Eluru',
      village: 'Pedavegi',
      email: 'ramesh@example.com',
      phone: '+91 9876543210',
      status: 'Active'
    },
    { 
      id: 'VND002', 
      name: 'Lakshmi Devi', 
      shgName: 'Toda SHG',
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      mandal: 'Anakapalle',
      village: 'Chodavaram',
      email: 'lakshmi@example.com',
      phone: '+91 9876543211',
      status: 'Active'
    },
  ])
  const [formData, setFormData] = useState({
    name: '',
    shgName: '',
    state: user?.state || 'Andhra Pradesh',
    district: user?.district || 'Eluru',
    mandal: '',
    village: '',
    email: '',
    phone: '',
    status: 'Active'
  })

  // Get unique SHG names for filter
  const uniqueSHGs = [...new Set(vendors.map(v => v.shgName))].sort()

  // Filter logic
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.phone.includes(searchQuery) ||
      (vendor.email && vendor.email.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesSHG = !shgFilter || vendor.shgName === shgFilter
    const matchesStatus = !statusFilter || vendor.status === statusFilter
    
    return matchesSearch && matchesSHG && matchesStatus
  })

  const clearFilters = () => {
    setSearchQuery('')
    setShgFilter('')
    setStatusFilter('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingVendor) {
      setVendors(prev => prev.map(vendor => 
        vendor.id === editingVendor.id 
          ? { ...vendor, ...formData, id: vendor.id }
          : vendor
      ))
      alert('Vendor updated successfully!')
    } else {
      const newVendor = {
        id: `VND${String(vendors.length + 1).padStart(3, '0')}`,
        ...formData
      }
      setVendors(prev => [...prev, newVendor])
      alert('Vendor added successfully!')
    }
    
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingVendor(null)
    setFormData({
      name: '',
      shgName: '',
      state: user?.state || 'Andhra Pradesh',
      district: user?.district || 'Eluru',
      mandal: '',
      village: '',
      email: '',
      phone: '',
      status: 'Active'
    })
  }

  const handleEdit = (vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.name,
      shgName: vendor.shgName,
      state: vendor.state || user?.state || 'Andhra Pradesh',
      district: vendor.district || user?.district || 'Eluru',
      mandal: vendor.mandal || '',
      village: vendor.village || '',
      email: vendor.email || '',
      phone: vendor.phone,
      status: vendor.status || 'Active'
    })
    setShowModal(true)
  }

  const handleDelete = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(prev => prev.filter(vendor => vendor.id !== vendorId))
      alert('Vendor deleted successfully!')
    }
  }

  const handleToggleStatus = (vendorId) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, status: vendor.status === 'Active' ? 'Inactive' : 'Active' }
        : vendor
    ))
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Vendors</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Vendor
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
              placeholder="Search by name, ID, phone, or email..."
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
          <table className="data-table" style={{ minWidth: '1200px', width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '120px' }}>Name</th>
                <th style={{ width: '120px' }}>SHG Name</th>
                <th style={{ width: '130px' }}>State</th>
                <th style={{ width: '120px' }}>District</th>
                <th style={{ width: '100px' }}>Mandal</th>
                <th style={{ width: '100px' }}>Village</th>
                <th style={{ width: '200px' }}>Email</th>
                <th style={{ width: '150px' }}>Phone</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td>{vendor.id}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.shgName}</td>
                    <td>{vendor.state}</td>
                    <td>{vendor.district}</td>
                    <td>{vendor.mandal}</td>
                    <td>{vendor.village}</td>
                    <td>{vendor.email || '-'}</td>
                    <td>{vendor.phone}</td>
                    <td>
                      <span className={`status-badge ${vendor.status.toLowerCase()}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-icon" 
                          title="Edit"
                          onClick={() => handleEdit(vendor)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-icon" 
                          title={vendor.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleStatus(vendor.id)}
                        >
                          {vendor.status === 'Active' ? '🔒' : '🔓'}
                        </button>
                        <button 
                          className="action-icon" 
                          title="Delete"
                          onClick={() => handleDelete(vendor.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    No vendors found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Vendor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '6rem', paddingBottom: '3rem', alignItems: 'flex-start', overflowY: 'auto' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Vendor Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Vendor Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter vendor name"
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

                {/* SHG Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    SHG Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="shgName"
                    value={formData.shgName}
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

                {/* State - Read-only */}
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

                {/* District - Read-only */}
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

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Phone <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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

                {/* Email */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="vendor@example.com"
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
                  {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageVendors
