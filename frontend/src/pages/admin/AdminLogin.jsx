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

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error messages
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.')
        } else if (response.status === 403) {
          setError('Your account has been deactivated. Please contact support.')
        } else {
          setError(data.detail || 'Login failed. Please try again.')
        }
        setLoading(false)
        return
      }

      // Check if user is admin
      if (data.user.role !== 'admin') {
        setError('Access denied. This portal is for Admin users only.')
        setLoading(false)
        return
      }

      login(data.user, data.access_token)
      navigate('/admin')
    } catch (err) {
      console.error('Login error:', err)
      setError('Unable to connect to server. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">
                <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="var(--color-primary)" opacity="0.1"/>
                  <path d="M20 8L24 16H16L20 8Z" fill="var(--color-primary)"/>
                  <path d="M12 18L16 26H8L12 18Z" fill="var(--color-secondary)"/>
                  <path d="M28 18L32 26H24L28 18Z" fill="var(--color-secondary)"/>
                  <path d="M20 22L24 30H16L20 22Z" fill="var(--color-accent)"/>
                  <circle cx="20" cy="20" r="3" fill="var(--color-primary)"/>
                </svg>
              </div>
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
