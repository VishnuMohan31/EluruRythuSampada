import React, { useState } from 'react'
import Button from '@components/common/Button'
import { logger, showToast, API_BASE_URL } from '@/utils/api'
import '../admin/Dashboard.css'

const Reports = () => {
  const [inquiryDateRange, setInquiryDateRange] = useState({ startDate: '', endDate: '' })
  const [productDateRange, setProductDateRange] = useState({ startDate: '', endDate: '' })

  const handleExportInquiries = async () => {
    try {
      // Validate dates only if both are provided
      if (inquiryDateRange.startDate && inquiryDateRange.endDate) {
        if (new Date(inquiryDateRange.startDate) > new Date(inquiryDateRange.endDate)) {
          showToast('Start date must be before end date', 'error')
          return
        }
      }

      logger.info('Exporting Inquiries Report', 'CSV download')
      const token = localStorage.getItem('authToken')
      
      // Build query params - only add if values exist
      const params = new URLSearchParams()
      if (inquiryDateRange.startDate) params.append('start_date', inquiryDateRange.startDate)
      if (inquiryDateRange.endDate) params.append('end_date', inquiryDateRange.endDate)
      
      const url = `${API_BASE_URL}/api/reports/inquiries/export${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        logger.error('Export Inquiries Failed', `${response.status} ${response.statusText}`)
        throw new Error('Failed to export inquiries')
      }
      
      const blob = await response.blob()
      const url2 = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url2
      const today = new Date()
      const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
      const dateRangeStr = inquiryDateRange.startDate && inquiryDateRange.endDate 
        ? `_${inquiryDateRange.startDate}_to_${inquiryDateRange.endDate}` 
        : ''
      a.download = `inquiries_export_${dateStr}${dateRangeStr}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url2)
      document.body.removeChild(a)
      
      logger.success('Inquiries Report Exported', a.download)
      showToast('Inquiries report exported successfully', 'success')
    } catch (error) {
      logger.error('Export Inquiries Failed', error.message)
      showToast('Failed to export inquiries', 'error')
    }
  }

  const handleExportProducts = async () => {
    try {
      // Validate dates only if both are provided
      if (productDateRange.startDate && productDateRange.endDate) {
        if (new Date(productDateRange.startDate) > new Date(productDateRange.endDate)) {
          showToast('Start date must be before end date', 'error')
          return
        }
      }

      logger.info('Exporting Products Report', 'CSV download')
      const token = localStorage.getItem('authToken')
      
      // Build query params - only add if values exist
      const params = new URLSearchParams()
      if (productDateRange.startDate) params.append('start_date', productDateRange.startDate)
      if (productDateRange.endDate) params.append('end_date', productDateRange.endDate)
      
      const url = `${API_BASE_URL}/api/reports/products/export${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        logger.error('Export Products Failed', `${response.status} ${response.statusText}`)
        throw new Error('Failed to export products')
      }
      
      const blob = await response.blob()
      const url2 = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url2
      const today = new Date()
      const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
      const dateRangeStr = productDateRange.startDate && productDateRange.endDate 
        ? `_${productDateRange.startDate}_to_${productDateRange.endDate}` 
        : ''
      a.download = `products_export_${dateStr}${dateRangeStr}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url2)
      document.body.removeChild(a)
      
      logger.success('Products Report Exported', a.download)
      showToast('Products report exported successfully', 'success')
    } catch (error) {
      logger.error('Export Products Failed', error.message)
      showToast('Failed to export products', 'error')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Reports</h1>
        <p>Generate and export reports</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Inquiry Report</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            Export all buyer-vendor contact inquiries
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Start Date <span style={{ color: 'var(--color-text-light)', fontWeight: '400' }}>(Optional)</span>
              </label>
              <input
                type="date"
                value={inquiryDateRange.startDate}
                onChange={(e) => setInquiryDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                End Date <span style={{ color: 'var(--color-text-light)', fontWeight: '400' }}>(Optional)</span>
              </label>
              <input
                type="date"
                value={inquiryDateRange.endDate}
                onChange={(e) => setInquiryDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            💡 Leave dates empty to export all records
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleExportInquiries}>
              {inquiryDateRange.startDate || inquiryDateRange.endDate ? 'Export Selected Range' : 'Export All Records'}
            </Button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Product Report</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            Export product listings and statistics
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Start Date <span style={{ color: 'var(--color-text-light)', fontWeight: '400' }}>(Optional)</span>
              </label>
              <input
                type="date"
                value={productDateRange.startDate}
                onChange={(e) => setProductDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                End Date <span style={{ color: 'var(--color-text-light)', fontWeight: '400' }}>(Optional)</span>
              </label>
              <input
                type="date"
                value={productDateRange.endDate}
                onChange={(e) => setProductDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            💡 Leave dates empty to export all records
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleExportProducts}>
              {productDateRange.startDate || productDateRange.endDate ? 'Export Selected Range' : 'Export All Records'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
