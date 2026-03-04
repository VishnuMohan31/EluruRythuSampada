import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

import Logo from '../../Images/Logo.jpeg'

const Footer = () => {
  const { t } = useTranslation()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <div className="footer-logo">
              <div className="logo-icon">
                <img src={Logo} alt="Eluru Rythu Sampada" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '12px' }} />
              </div>
              <div className="logo-text">
                <span className="logo-title">Eluru Rythu Sampada</span>
              </div>
            </div>
            <p className="footer-description">
              Empowering farming communities through direct market access.
              Supporting local farmers and sustainable agriculture.
            </p>
          </div>

          <div className="footer-section footer-links-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" onClick={scrollToTop}>{t('home')}</Link></li>
              <li><Link to="/products" onClick={scrollToTop}>{t('products')}</Link></li>
              <li><Link to="/about" onClick={scrollToTop}>{t('about')}</Link></li>
              <li><Link to="/terms" onClick={scrollToTop}>Terms & Conditions</Link></li>
              <li><Link to="/privacy" onClick={scrollToTop}>Privacy Policy</Link></li>
              <li><Link to="/disclaimer" onClick={scrollToTop}>Disclaimer</Link></li>
            </ul>
          </div>

          <div className="footer-section footer-contact-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>📧 info@swayameluru.com</li>
              <li>📞 +91 1234567890</li>
              <li>📍 India</li>
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
            © 2026 Eluru Rythu Sampada. All rights reserved.
          </p>
          <p className="footer-credit">
            <strong>Powered by</strong> DataLegos Tech Solutions Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
