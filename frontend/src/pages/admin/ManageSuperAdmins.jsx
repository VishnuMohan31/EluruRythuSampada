import React from 'react'
import Button from '@components/common/Button'
import './Dashboard.css'

const ManageSuperAdmins = () => {
  const superAdmins = [
    { id: 'USR002', name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 'USR003', name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Super Admins</h1>
        <Button variant="primary">+ Add Super Admin</Button>
      </div>

      <div className="dashboard-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {superAdmins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td><span className="status-badge active">{admin.status}</span></td>
                  <td>
                    <div className="table-actions">
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
    </div>
  )
}

export default ManageSuperAdmins
