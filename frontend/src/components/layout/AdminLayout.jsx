import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { showToast } from '@/utils/api'
import { LayoutDashboard, UserCog, BarChart3, ExternalLink, User, ShieldCheck } from 'lucide-react'
import Logo from '../../Images/Logo.jpeg'
import './AdminLayout.css'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    console.log('🚪 Admin logging out')
    logout()
    showToast('Logged out successfully', 'success')
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon"><ShieldCheck size={24} /></span>
            {sidebarOpen && <span className="logo-text">Admin Panel</span>}
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className={`toggle-arrow ${sidebarOpen ? 'open' : 'closed'}`}>
            {sidebarOpen ? '«' : '»'}
          </span>
        </button>

        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item" data-tooltip="Dashboard">
            <span className="nav-icon"><LayoutDashboard size={20} /></span>
            {sidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          <Link to="/admin/super-admins" className="nav-item" data-tooltip="Super Admins">
            <span className="nav-icon"><UserCog size={20} /></span>
            {sidebarOpen && <span className="nav-text">Super Admins</span>}
          </Link>
          <Link to="/admin/reports" className="nav-item" data-tooltip="Reports">
            <span className="nav-icon"><BarChart3 size={20} /></span>
            {sidebarOpen && <span className="nav-text">Reports</span>}
          </Link>
          <Link to="/admin/profile" className="nav-item" data-tooltip="My Profile">
            <span className="nav-icon"><User size={20} /></span>
            {sidebarOpen && <span className="nav-text">My Profile</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item" data-tooltip="Public Site">
            <span className="nav-icon"><ExternalLink size={20} /></span>
            {sidebarOpen && <span className="nav-text">Public Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          {/* Center Logo and Title */}
          <div className="header-branding">
            <div className="header-logo-icon">
              <img src={Logo} alt="Eluru Rythu Sampada" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} />
            </div>
            <div className="header-title">
              <span className="header-title-main">Eluru Rythu Sampada</span>
            </div>
          </div>

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
