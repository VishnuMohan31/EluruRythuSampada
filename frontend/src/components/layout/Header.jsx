import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import './Header.css'

import Logo from '../../Images/Logo.jpeg'
import CMImage from '../../Images/CM_Image.png.jpeg'
import APEmblem from '../../Images/Emblem_of_Andhra_Pradesh.png'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* CM & AP Emblem block - now on the LEFT */}
          <div className="header-cm-block" aria-label="Hon'ble Chief Minister and Government of Andhra Pradesh">
            <div className="header-cm-photo-wrap">
              <img src={CMImage} alt="Hon'ble Chief Minister" className="header-cm-photo" />
            </div>
            <div className="header-cm-text">
              <span className="header-cm-name">Sri Nara Chandrababu Naidu</span>
              <span className="header-cm-title">Hon'ble Chief Minister of Andhra Pradesh</span>
            </div>
            <div className="header-emblem-wrap">
              <img src={APEmblem} alt="Government of Andhra Pradesh" className="header-emblem" />
            </div>
          </div>

          {/* Logo - now in CENTER */}
          <Link to="/" className="header-logo">
            <div className="logo-icon">
              <img src={Logo} alt="Eluru Rythu Sampada" className="logo-image" />
            </div>
            <div className="logo-text">
              <span className="logo-title">Eluru Rythu Sampada</span>
            </div>
          </Link>

          {/* Actions */}
          <div className="header-actions">
            {/* Auth Actions */}
            {authenticated ? (
              <div className="user-section">
                <NavLink to={user?.role === 'admin' ? '/admin' : '/super-admin'} className="nav-link">
                  Dashboard
                </NavLink>
                <div className="user-info">
                  <span className="user-avatar">{user?.full_name?.charAt(0) || 'U'}</span>
                  <span className="user-name">{user?.full_name}</span>
                </div>
                <button className="btn btn-outline btn-small" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/super-admin/login" className="btn btn-outline btn-medium">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <span className="close-icon">✕</span>
              ) : (
                <span className="hamburger"></span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - only show dashboard if authenticated */}
        {mobileMenuOpen && authenticated && (
          <nav className="mobile-nav">
            <Link
              to={user?.role === 'admin' ? '/admin' : '/super-admin'}
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
