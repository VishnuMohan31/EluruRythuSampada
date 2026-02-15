import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import './AdminLayout.css'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="var(--color-primary)" opacity="0.1"/>
                <path d="M20 8L24 16H16L20 8Z" fill="var(--color-primary)"/>
                <path d="M12 18L16 26H8L12 18Z" fill="var(--color-secondary)"/>
                <path d="M28 18L32 26H24L28 18Z" fill="var(--color-secondary)"/>
                <path d="M20 22L24 30H16L20 22Z" fill="var(--color-accent)"/>
                <circle cx="20" cy="20" r="3" fill="var(--color-primary)"/>
              </svg>
            </span>
            {sidebarOpen && <span className="logo-text">Admin Panel</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          <Link to="/admin/super-admins" className="nav-item">
            <span className="nav-icon">👥</span>
            {sidebarOpen && <span className="nav-text">Super Admins</span>}
          </Link>
          <Link to="/admin/config" className="nav-item">
            <span className="nav-icon">⚙️</span>
            {sidebarOpen && <span className="nav-text">Configuration</span>}
          </Link>
          <Link to="/admin/audit-logs" className="nav-item">
            <span className="nav-icon">📝</span>
            {sidebarOpen && <span className="nav-text">Audit Logs</span>}
          </Link>
          <Link to="/admin/reports" className="nav-item">
            <span className="nav-icon">📈</span>
            {sidebarOpen && <span className="nav-text">Reports</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            {sidebarOpen && <span className="nav-text">Public Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <div className="header-actions">
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">{user?.full_name?.charAt(0) || 'A'}</span>
                <div className="user-details">
                  <span className="user-name">{user?.full_name || 'Admin'}</span>
                  <span className="user-role">Administrator</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
