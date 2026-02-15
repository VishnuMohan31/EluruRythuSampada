import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import './AuthPage.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Mock login - replace with actual API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        login(
          { id: 'USR001', email: formData.email, full_name: 'Admin User', role: 'admin' },
          'mock-token-123'
        )
        navigate('/admin')
      } else {
        setError('Invalid credentials')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🏛</span>
              <span className="logo-text">Swayam Eluru Market Place</span>
            </div>
            <h1>Admin Login</h1>
            <p>Sign in to access the admin dashboard</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <a href="/">← Back to Public Site</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
