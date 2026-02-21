import React from 'react'
import Button from '@components/common/Button'
import { logger } from '@/utils/api'

const Reports = () => {
  const handleExportInquiries = async () => {
    try {
      logger.info('Exporting Inquiries Report', 'CSV download')
      const token = localStorage.getItem('authToken')
      
      const response = await fetch('http://localhost:8000/api/reports/inquiries/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        logger.error('Export Inquiries Failed', `${response.status} ${response.statusText}`)
        throw new Error('Failed to export inquiries')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const today = new Date()
      const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
      a.download = `inquiries_export_${dateStr}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      logger.success('Inquiries Report Exported', a.download)
    } catch (error) {
      logger.error('Export Inquiries Failed', error.message)
      alert('Failed to export inquiries')
    }
  }

  const handleExportAnalytics = async () => {
    try {
      logger.info('Exporting Analytics Report', 'CSV download')
      const token = localStorage.getItem('authToken')
      
      const response = await fetch('http://localhost:8000/api/reports/analytics/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        logger.error('Export Analytics Failed', `${response.status} ${response.statusText}`)
        throw new Error('Failed to export analytics')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const today = new Date()
      const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
      a.download = `analytics_export_${dateStr}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      logger.success('Analytics Report Exported', a.download)
    } catch (error) {
      logger.error('Export Analytics Failed', error.message)
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
