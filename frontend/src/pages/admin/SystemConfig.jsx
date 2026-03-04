import { useState } from 'react'
import Button from '@components/common/Button'
import CustomSelect from '@components/common/CustomSelect'
import { useTheme } from '@context/ThemeContext'

const SystemConfig = () => {
  const { themes, currentTheme, changeTheme } = useTheme()
  const [appName, setAppName] = useState('Eluru Rythu Sampada')
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [language, setLanguage] = useState('en')

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId)
    // Apply theme immediately when selected
    changeTheme(themeId)
  }

  const handleSave = (e) => {
    e.preventDefault()
    alert('Configuration saved successfully!')
    console.log({ appName, theme: selectedTheme, language })
  }

  // Prepare theme options for CustomSelect
  const themeOptions = themes.map(theme => ({
    value: theme.id,
    label: theme.name
  }))

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'te', label: 'Telugu (తెలుగు)' }
  ]

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
              Default Theme
            </label>
            <CustomSelect
              options={themeOptions}
              value={selectedTheme}
              onChange={handleThemeChange}
              placeholder="Select Theme"
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Default Language
            </label>
            <CustomSelect
              options={languageOptions}
              value={language}
              onChange={setLanguage}
              placeholder="Select Language"
            />
          </div>
          
          <Button type="submit" variant="primary">Save Changes</Button>
        </form>
      </div>
    </div>
  )
}

export default SystemConfig
