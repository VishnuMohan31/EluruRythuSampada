import React from 'react'
import Button from '@components/common/Button'

const Reports = () => {
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
          <Button variant="primary">Export CSV</Button>
        </div>

        <div className="dashboard-card">
          <h3>Analytics Report</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            Export platform analytics and statistics
          </p>
          <Button variant="primary">Export CSV</Button>
        </div>
      </div>
    </div>
  )
}

export default Reports
