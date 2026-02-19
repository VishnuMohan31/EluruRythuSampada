import React from 'react'
import Button from '@components/common/Button'

const Reports = () => {
  const handleExportInquiries = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/reports/inquiries/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to export inquiries')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inquiries_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting inquiries:', error)
      alert('Failed to export inquiries')
    }
  }

  const handleExportAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/reports/analytics/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to export analytics')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting analytics:', error)
      alert('Failed to export analytics')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Reports</h1>
        <p>Generate and export platform reports</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Inquiry Report</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            Export all buyer-vendor contact inquiries
          </p>
          <Button variant="primary" onClick={handleExportInquiries}>Export CSV</Button>
        </div>

        <div className="dashboard-card">
          <h3>Analytics Report</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            Export platform analytics and statistics
          </p>
          <Button variant="primary" onClick={handleExportAnalytics}>Export CSV</Button>
        </div>
      </div>
    </div>
  )
}

export default Reports
