import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { showToast, API_BASE_URL } from '@/utils/api'
import '../admin/AuthPage.css'

import Logo from '../../Images/Logo.jpeg'

const SuperAdminLogin = () => {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Login failed. Please try again.'
        
        try {
          const data = await response.json()
          // Ensure error message is always a string
          if (typeof data.detail === 'string') {
            errorMessage = data.detail
          } else if (typeof data.message === 'string') {
            errorMessage = data.message
          } else if (typeof data === 'string') {
            errorMessage = data
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }
        
        // Handle specific error messages based on status
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.')
        } else if (response.status === 403) {
          setError('Your account has been deactivated. Please contact support.')
        } else {
          setError(errorMessage)
        }
        setLoading(false)
        return
      }

      const data = await response.json()

      // Check if user is super_admin
      if (data.user.role !== 'super_admin') {
        setError('Access denied. This portal is for Super Admin users only.')
        setLoading(false)
        return
      }

      login(data.user, data.access_token)
      console.log('✅ Super Admin login successful:', data.user.email)
      showToast('Login successful! Welcome back.', 'success')
      navigate('/super-admin')
    } catch (err) {
      console.error('❌ Login error:', err)
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Unable to connect to server. Please check your connection and try again.'
      setError(errorMessage)
      showToast('Login failed. Please try again.', 'error')
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
                <img src={Logo} alt="Eluru Rythu Sampada" className="auth-logo-img" />
              </div>
              <span className="logo-text">Eluru Rythu Sampada</span>
            </div>
            <h1>Super Admin Login</h1>
            <p>Sign in to manage content and products</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="superadmin@example.com"
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

export default SuperAdminLogin
