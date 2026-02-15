import React from 'react'
import { mockStats } from '@/data/mockData'
import './Dashboard.css'

const AdminDashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform statistics and activity</p>
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
            <div className="stat-label">Tribal Communities</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalVendors}</div>
            <div className="stat-label">Active Vendors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalBuyers}</div>
            <div className="stat-label">Registered Buyers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalContacts}</div>
            <div className="stat-label">Vendor Contacts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalViews.toLocaleString()}</div>
            <div className="stat-label">Product Views</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-content">
                <p>Product "Handwoven Basket" approved</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <p>New Super Admin created: John Doe</p>
                <span className="activity-time">5 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">⚙️</span>
              <div className="activity-content">
                <p>System configuration updated</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a href="/admin/super-admins" className="action-btn">
              <span>👥</span>
              <span>Manage Super Admins</span>
            </a>
            <a href="/admin/config" className="action-btn">
              <span>⚙️</span>
              <span>System Configuration</span>
            </a>
            <a href="/admin/audit-logs" className="action-btn">
              <span>📝</span>
              <span>View Audit Logs</span>
            </a>
            <a href="/admin/reports" className="action-btn">
              <span>📈</span>
              <span>Generate Reports</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
