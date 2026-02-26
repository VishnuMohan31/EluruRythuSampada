import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { useTheme } from '@context/ThemeContext'
import { useLanguage } from '@context/LanguageContext'
import { showToast } from '@/utils/api'
import { LayoutDashboard, Users, Package, Tag, BarChart3, ExternalLink, User, Shield } from 'lucide-react'
import './AdminLayout.css'

const SuperAdminLayout = () => {
  const { user, logout } = useAuth()
  const { themes, currentTheme, changeTheme } = useTheme()
  const { languages, currentLanguage, changeLanguage } = useLanguage()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const handleLogout = () => {
    console.log('🚪 Super Admin logging out')
    logout()
    showToast('Logged out successfully', 'success')
    navigate('/super-admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon"><Shield size={24} /></span>
            {sidebarOpen && <span className="logo-text">Super Admin</span>}
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
          <Link to="/super-admin" className="nav-item" data-tooltip="Dashboard">
            <span className="nav-icon"><LayoutDashboard size={20} /></span>
            {sidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          <Link to="/super-admin/shgs" className="nav-item" data-tooltip="SHGs">
            <span className="nav-icon"><Users size={20} /></span>
            {sidebarOpen && <span className="nav-text">SHGs</span>}
          </Link>
          <Link to="/super-admin/products" className="nav-item" data-tooltip="Products">
            <span className="nav-icon"><Package size={20} /></span>
            {sidebarOpen && <span className="nav-text">Products</span>}
          </Link>
          <Link to="/super-admin/categories" className="nav-item" data-tooltip="Categories">
            <span className="nav-icon"><Tag size={20} /></span>
            {sidebarOpen && <span className="nav-text">Categories</span>}
          </Link>
          <Link to="/super-admin/reports" className="nav-item" data-tooltip="Reports">
            <span className="nav-icon"><BarChart3 size={20} /></span>
            {sidebarOpen && <span className="nav-text">Reports</span>}
          </Link>
          <Link to="/super-admin/profile" className="nav-item" data-tooltip="My Profile">
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

      <div className="admin-main">
        <header className="admin-header">
          {/* Center Logo and Title */}
          <div className="header-branding">
            <div className="header-logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="var(--color-primary)" opacity="0.1"/>
                <path d="M20 8L24 16H16L20 8Z" fill="var(--color-primary)"/>
                <path d="M12 18L16 26H8L12 18Z" fill="var(--color-secondary)"/>
                <path d="M28 18L32 26H24L28 18Z" fill="var(--color-secondary)"/>
                <path d="M20 22L24 30H16L20 22Z" fill="var(--color-accent)"/>
                <circle cx="20" cy="20" r="3" fill="var(--color-primary)"/>
              </svg>
            </div>
            <div className="header-title">
              <span className="header-title-main">Swayam Eluru</span>
              <span className="header-title-sub">Market Place</span>
            </div>
          </div>

          <div className="header-actions">
            {/* Language Switcher */}
            <div className="dropdown">
              <button
                className="text-button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Change language"
              >
                Language
              </button>
              {langMenuOpen && (
                <div className="dropdown-menu">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`dropdown-item ${currentLanguage === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        changeLanguage(lang.code)
                        setLangMenuOpen(false)
                      }}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <div className="dropdown">
              <button
                className="text-button"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                aria-label="Change theme"
              >
                Theme
              </button>
              {themeMenuOpen && (
                <div className="dropdown-menu">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      className={`dropdown-item ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => {
                        changeTheme(theme.id)
                        setThemeMenuOpen(false)
                      }}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">{user?.full_name?.charAt(0) || 'S'}</span>
                <div className="user-details">
                  <span className="user-name">{user?.full_name || 'Super Admin'}</span>
                  <span className="user-role">Super Administrator</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SuperAdminLayout
