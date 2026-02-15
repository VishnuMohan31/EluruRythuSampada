import React from 'react'
import Button from '@components/common/Button'
import '../admin/Dashboard.css'

const ManageVendors = () => {
  const vendors = [
    { id: 'VND001', name: 'Ramesh Kumar', tribe: 'Gond', phone: '+91 9876543210', status: 'Approved' },
    { id: 'VND002', name: 'Lakshmi Devi', tribe: 'Toda', phone: '+91 9876543211', status: 'Pending' },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Vendors</h1>
        <Button variant="primary">+ Add Vendor</Button>
      </div>

      <div className="dashboard-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Tribe</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td>{vendor.name}</td>
                <td>{vendor.tribe}</td>
                <td>{vendor.phone}</td>
                <td>
                  <span className={`status-badge ${vendor.status.toLowerCase()}`}>
                    {vendor.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    {vendor.status === 'Pending' && (
                      <>
                        <button className="action-icon">✅</button>
                        <button className="action-icon">❌</button>
                      </>
                    )}
                    <button className="action-icon">✏️</button>
                    <button className="action-icon">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageVendors
