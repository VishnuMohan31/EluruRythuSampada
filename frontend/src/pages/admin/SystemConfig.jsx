import React from 'react'
import Button from '@components/common/Button'
import Input from '@components/common/Input'

const SystemConfig = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>System Configuration</h1>
        <p>Manage application settings and branding</p>
      </div>

      <div className="dashboard-card">
        <h3>Branding</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Application Name" value="Swayam Eluru Market Place" />
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Logo
            </label>
            <Button variant="outline">Upload Logo</Button>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Default Theme
            </label>
            <select style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--color-border)', width: '100%' }}>
              <option>Tribal Earth</option>
              <option>Government Heritage</option>
              <option>Modern Marketplace</option>
            </select>
          </div>
          <Button variant="primary">Save Changes</Button>
        </form>
      </div>
    </div>
  )
}

export default SystemConfig
