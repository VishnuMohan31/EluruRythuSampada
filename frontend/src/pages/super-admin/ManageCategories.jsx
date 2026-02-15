import React from 'react'
import Button from '@components/common/Button'
import { mockCategories } from '@/data/mockData'
import '../admin/Dashboard.css'

const ManageCategories = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Categories</h1>
        <Button variant="primary">+ Add Category</Button>
      </div>

      <div className="dashboard-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCategories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.icon}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.productCount}</td>
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

export default ManageCategories
