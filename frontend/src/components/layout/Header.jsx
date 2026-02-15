import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@context/ThemeContext'
import { useLanguage } from '@context/LanguageContext'
import { useAuth } from '@context/AuthContext'
import './Header.css'

const Header = () => {
  const { t } = useTranslation()
  const { themes, currentTheme, changeTheme } = useTheme()
  const { languages, currentLanguage, changeLanguage } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  
  // Refs for dropdown menus
  const themeDropdownRef = useRef(null)
  const langDropdownRef = useRef(null)
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setThemeMenuOpen(false)
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="var(--color-primary)" opacity="0.1"/>
                <path d="M20 8L24 16H16L20 8Z" fill="var(--color-primary)"/>
                <path d="M12 18L16 26H8L12 18Z" fill="var(--color-secondary)"/>
                <path d="M28 18L32 26H24L28 18Z" fill="var(--color-secondary)"/>
                <path d="M20 22L24 30H16L20 22Z" fill="var(--color-accent)"/>
                <circle cx="20" cy="20" r="3" fill="var(--color-primary)"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">Swayam Eluru</span>
              <span className="logo-subtitle">Market Place</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <NavLink to="/" className="nav-link" end>{t('home')}</NavLink>
            <NavLink to="/products" className="nav-link">{t('products')}</NavLink>
            <NavLink to="/about" className="nav-link">{t('about')}</NavLink>
            {isAuthenticated() && (
              <NavLink to={user?.role === 'admin' ? '/admin' : '/super-admin'} className="nav-link">
                {t('dashboard')}
              </NavLink>
            )}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Language Switcher */}
            <div className="dropdown" ref={langDropdownRef}>
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
            <div className="dropdown" ref={themeDropdownRef}>
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

            {/* Auth Actions */}
            {isAuthenticated() ? (
              <div className="user-section">
                <div className="user-info">
                  <span className="user-avatar">{user?.full_name?.charAt(0) || 'U'}</span>
                  <span className="user-name">{user?.full_name}</span>
                </div>
                <button className="btn btn-outline btn-small" onClick={handleLogout}>
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="btn btn-outline btn-medium">
                {t('login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link to="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {t('products')}
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {t('about')}
            </Link>
            {isAuthenticated() && (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/super-admin'}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dashboard')}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
