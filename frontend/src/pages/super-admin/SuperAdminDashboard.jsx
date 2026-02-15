import React from 'react'
import { mockStats } from '@/data/mockData'
import '../admin/Dashboard.css'

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Manage content and products</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏛</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalTribes}</div>
            <div className="stat-label">Tribes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalVendors}</div>
            <div className="stat-label">Vendors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalContacts}</div>
            <div className="stat-label">Contacts</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a href="/super-admin/products" className="action-btn">
              <span>📦</span>
              <span>Manage Products</span>
            </a>
            <a href="/super-admin/tribes" className="action-btn">
              <span>🏛</span>
              <span>Manage Tribes</span>
            </a>
            <a href="/super-admin/vendors" className="action-btn">
              <span>🏪</span>
              <span>Manage Vendors</span>
            </a>
            <a href="/super-admin/categories" className="action-btn">
              <span>🏷</span>
              <span>Manage Categories</span>
            </a>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Pending Approvals</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div className="activity-content">
                <p>3 products pending approval</p>
                <span className="activity-time">Review now</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🏪</span>
              <div className="activity-content">
                <p>2 vendors pending approval</p>
                <span className="activity-time">Review now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
