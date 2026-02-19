import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Button from '@components/common/Button'
import Input from '@components/common/Input'

const SystemConfig = () => {
  const [appName, setAppName] = useState('Swayam Eluru Market Place')
  const [theme, setTheme] = useState('Tribal Earth')
  const [language, setLanguage] = useState('en')
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // API call will go here
    alert('Configuration saved successfully!')
    console.log({ appName, theme, language })
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long!')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/users/me/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to change password')
      }

      alert('Password changed successfully!')
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      alert(error.message || 'Failed to change password. Please try again.')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>System Configuration</h1>
        <p>Manage application settings and branding</p>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Branding</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Application Name" 
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Logo
            </label>
            <Button type="button" variant="outline">Upload Logo</Button>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Default Theme
            </label>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '2px solid var(--color-border)', 
                width: '100%',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="Tribal Earth">Tribal Earth</option>
              <option value="Government Heritage">Government Heritage</option>
              <option value="Modern Marketplace">Modern Marketplace</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Default Language
            </label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '2px solid var(--color-border)', 
                width: '100%',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="en">English</option>
              <option value="te">Telugu (తెలుగు)</option>
            </select>
          </div>
          <Button type="submit" variant="primary">Save Changes</Button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="dashboard-card">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          {/* Current Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Current Password <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  paddingRight: '2.5rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text-light)'
                }}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              New Password <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  paddingRight: '2.5rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text-light)'
                }}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Confirm New Password <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  paddingRight: '2.5rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text-light)'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary">Change Password</Button>
        </form>
      </div>
    </div>
  )
}

export default SystemConfig
