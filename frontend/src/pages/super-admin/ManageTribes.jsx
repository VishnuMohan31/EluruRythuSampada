import React from 'react'
import Button from '@components/common/Button'
import { mockTribes } from '@/data/mockData'
import '../admin/Dashboard.css'

const ManageTribes = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Tribes</h1>
        <Button variant="primary">+ Add Tribe</Button>
      </div>

      <div className="dashboard-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>State</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTribes.map(tribe => (
              <tr key={tribe.id}>
                <td>{tribe.id}</td>
                <td>{tribe.name}</td>
                <td>{tribe.state}</td>
                <td>{tribe.description.substring(0, 50)}...</td>
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
  )
}

export default ManageTribes
