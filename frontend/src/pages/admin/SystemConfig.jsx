import { useState } from 'react'
import Button from '@components/common/Button'

const SystemConfig = () => {
  const [appName, setAppName] = useState('Swayam Eluru Market Place')
  const [theme, setTheme] = useState('Earth Theme')
  const [language, setLanguage] = useState('en')

  const handleSave = (e) => {
    e.preventDefault()
    alert('Configuration saved successfully!')
    console.log({ appName, theme, language })
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>System Configuration</h1>
        <p>Manage application settings and branding</p>
      </div>

      <div className="dashboard-card">
        <h3>Branding</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Application Name
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--color-border)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
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
              <option value="Earth Theme">Earth Theme</option>
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
    </div>
  )
}

export default SystemConfig
