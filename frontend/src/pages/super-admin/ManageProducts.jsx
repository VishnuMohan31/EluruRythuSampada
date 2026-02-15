import React from 'react'
import Button from '@components/common/Button'
import { mockProducts } from '@/data/mockData'
import '../admin/Dashboard.css'

const ManageProducts = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Products</h1>
        <Button variant="primary">+ Add Product</Button>
      </div>

      <div className="dashboard-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Tribe</th>
              <th>Status</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.slice(0, 5).map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{product.tribe.name}</td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>{product.viewCount}</td>
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

export default ManageProducts
