import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { LogIn, LogOut, Search } from 'lucide-react'
import './Header.css'

import Logo from '../../Images/Logo.jpeg'
import CMImage from '../../Images/CM_Image.png.jpeg'
import APEmblem from '../../Images/Emblem_of_Andhra_Pradesh.png'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Auto-focus when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Escape to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeSearch()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      closeSearch()
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    // Live filter from first character — navigate with replace so no history spam
    navigate(val.trim() ? `/?search=${encodeURIComponent(val.trim())}` : '/', { replace: true })
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* CM & AP Emblem block - LEFT */}
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

            {/* Logo - CENTER */}
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
              {authenticated ? (
                <div className="user-section">
                  <NavLink to={user?.role === 'admin' ? '/admin' : '/super-admin'} className="nav-link">
                    Dashboard
                  </NavLink>
                  <div className="user-info">
                    <span className="user-avatar">{user?.full_name?.charAt(0) || 'U'}</span>
                    <span className="user-name">{user?.full_name}</span>
                  </div>
                  <button className="header-search-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                    <Search size={20} />
                  </button>
                  <button className="auth-icon-btn logout-icon-btn" onClick={handleLogout} aria-label="Logout">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <>
                  <button className="header-search-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                    <Search size={20} />
                  </button>
                  <Link to="/super-admin/login" className="auth-icon-btn login-icon-btn" aria-label="Login">
                    <LogIn size={22} />
                  </Link>
                </>
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

          {/* Mobile Navigation */}
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

      {/* Search Overlay — Option 2 */}
      {searchOpen && (
        <div className="header-search-overlay" onClick={closeSearch}>
          <form className="header-search-box" onClick={e => e.stopPropagation()} onSubmit={handleSearchSubmit}>
            <Search size={20} className="header-search-overlay-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => handleSearchChange(e)}
              className="header-search-overlay-input"
            />
            <button type="button" className="header-search-overlay-close" onClick={closeSearch}>✕</button>
          </form>
        </div>
      )}
    </>
  )
}

export default Header
