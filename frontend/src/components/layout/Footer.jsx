import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
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
            </div>
            <p className="footer-description">
              Empowering SHG communities through authentic handcrafted products.
              Preserving heritage, supporting artisans.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/products">{t('products')}</Link></li>
              <li><Link to="/about">{t('about')}</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=handicrafts">Handicrafts</Link></li>
              <li><Link to="/products?category=textiles">Textiles</Link></li>
              <li><Link to="/products?category=jewelry">Jewelry</Link></li>
              <li><Link to="/products?category=pottery">Pottery</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>📧 info@swayameluru.com</li>
              <li>📞 +91 1234567890</li>
              <li>📍 Andhra Pradesh, India</li>
            </ul>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="YouTube">📺</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 Swayam Eluru Market Place. All rights reserved.
          </p>
          <p className="footer-credit">
            Powered by DataLegos Tech Solutions Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
