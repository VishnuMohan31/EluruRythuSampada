import { useState } from 'react'
import { mockStats } from '@/data/mockData'
import '../admin/Dashboard.css'

const SuperAdminDashboard = () => {
  const [metricType, setMetricType] = useState('shg') // 'shg' or 'product'
  const [shgTimePeriod, setShgTimePeriod] = useState('30') // For SHG Inquiries
  // Product metrics always use 'all' time period

  // Mock data for metrics
  const topSHGInquiries = [
    { id: 'SHG001', name: 'Gond SHG', inquiries: 245, state: 'Andhra Pradesh' },
    { id: 'SHG004', name: 'Lambadi SHG', inquiries: 198, state: 'Andhra Pradesh' },
    { id: 'SHG007', name: 'Chenchu SHG', inquiries: 176, state: 'Andhra Pradesh' },
    { id: 'SHG002', name: 'Toda SHG', inquiries: 154, state: 'Tamil Nadu' },
    { id: 'SHG003', name: 'Kota SHG', inquiries: 142, state: 'Andhra Pradesh' },
    { id: 'SHG005', name: 'Warli SHG', inquiries: 128, state: 'Maharashtra' },
    { id: 'SHG006', name: 'Bastar SHG', inquiries: 115, state: 'Chhattisgarh' },
    { id: 'SHG008', name: 'Bhil SHG', inquiries: 98, state: 'Rajasthan' },
    { id: 'SHG009', name: 'Santhal SHG', inquiries: 87, state: 'Jharkhand' },
    { id: 'SHG010', name: 'Munda SHG', inquiries: 76, state: 'Odisha' },
  ]

  const leastSHGInquiries = [
    { id: 'SHG020', name: 'Khasi SHG', inquiries: 12, state: 'Meghalaya' },
    { id: 'SHG019', name: 'Garo SHG', inquiries: 15, state: 'Meghalaya' },
    { id: 'SHG018', name: 'Naga SHG', inquiries: 18, state: 'Nagaland' },
    { id: 'SHG017', name: 'Mizo SHG', inquiries: 21, state: 'Mizoram' },
    { id: 'SHG016', name: 'Bodo SHG', inquiries: 24, state: 'Assam' },
    { id: 'SHG015', name: 'Lepcha SHG', inquiries: 28, state: 'Sikkim' },
    { id: 'SHG014', name: 'Dimasa SHG', inquiries: 32, state: 'Assam' },
    { id: 'SHG013', name: 'Karbi SHG', inquiries: 35, state: 'Assam' },
    { id: 'SHG012', name: 'Rabha SHG', inquiries: 39, state: 'Assam' },
    { id: 'SHG011', name: 'Tiwa SHG', inquiries: 42, state: 'Assam' },
  ]

  const topProductInquiries = [
    { id: 'PRD001', name: 'Bamboo Tokri', inquiries: 456, shg: 'Gond SHG' },
    { id: 'PRD002', name: 'Toda Poothkuli', inquiries: 389, shg: 'Toda SHG' },
    { id: 'PRD004', name: 'Lambadi Haar', inquiries: 345, shg: 'Lambadi SHG' },
    { id: 'PRD003', name: 'Mitti Ka Matka', inquiries: 312, shg: 'Kota SHG' },
    { id: 'PRD008', name: 'Jungle Madhu', inquiries: 287, shg: 'Chenchu SHG' },
    { id: 'PRD005', name: 'Warli Chitra', inquiries: 256, shg: 'Warli SHG' },
    { id: 'PRD007', name: 'Dhokra Ghoda', inquiries: 234, shg: 'Bastar SHG' },
    { id: 'PRD006', name: 'Handloom Khadi Saree', inquiries: 198, shg: 'Gond SHG' },
    { id: 'PRD009', name: 'Bamboo Diya Stand', inquiries: 176, shg: 'Gond SHG' },
    { id: 'PRD010', name: 'Lambadi Toran', inquiries: 154, shg: 'Lambadi SHG' },
  ]

  const leastProductInquiries = [
    { id: 'PRD030', name: 'Cane Basket', inquiries: 8, shg: 'Khasi SHG' },
    { id: 'PRD029', name: 'Bamboo Hat', inquiries: 11, shg: 'Garo SHG' },
    { id: 'PRD028', name: 'Tribal Mask', inquiries: 14, shg: 'Naga SHG' },
    { id: 'PRD027', name: 'Woven Shawl', inquiries: 17, shg: 'Mizo SHG' },
    { id: 'PRD026', name: 'Cane Furniture', inquiries: 20, shg: 'Bodo SHG' },
    { id: 'PRD025', name: 'Carpet', inquiries: 23, shg: 'Lepcha SHG' },
    { id: 'PRD024', name: 'Wooden Bowl', inquiries: 26, shg: 'Dimasa SHG' },
    { id: 'PRD023', name: 'Bamboo Flute', inquiries: 29, shg: 'Karbi SHG' },
    { id: 'PRD022', name: 'Clay Doll', inquiries: 32, shg: 'Rabha SHG' },
    { id: 'PRD021', name: 'Brass Plate', inquiries: 35, shg: 'Tiwa SHG' },
  ]

  const renderListItem = (item, index, isProduct = false, isLeast = false) => {
    const label = metricType === 'product' ? 'products' : 'inquiries'
    
    return (
      <div
        key={item.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--color-background)',
          borderRadius: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '1.25rem', 
            color: !isLeast && index < 3 ? 'var(--color-primary)' : 'var(--color-text-light)',
            minWidth: '30px'
          }}>
            {index + 1}
          </span>
          <div>
            <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
              {isProduct ? item.shg : item.state}
            </div>
          </div>
        </div>
        <div>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '0.875rem',
            color: isLeast ? '#DC2626' : 'inherit'
          }}>
            {item.inquiries} {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Manage content and products</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏛</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalSHGs}</div>
            <div className="stat-label">SHGs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalVendors}</div>
            <div className="stat-label">Vendors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalContacts}</div>
            <div className="stat-label">Contacts</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>📊 Performance Metrics</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Metric Type Toggle - SHG or Product */}
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--color-background)', padding: '0.25rem', borderRadius: '8px' }}>
              <button
                onClick={() => setMetricType('shg')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: metricType === 'shg' ? 'var(--color-primary)' : 'transparent',
                  color: metricType === 'shg' ? 'white' : 'var(--color-text)',
                  transition: 'all 0.2s'
                }}
              >
                🏛 SHG Inquiries
              </button>
              <button
                onClick={() => setMetricType('product')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: metricType === 'product' ? 'var(--color-primary)' : 'transparent',
                  color: metricType === 'product' ? 'white' : 'var(--color-text)',
                  transition: 'all 0.2s'
                }}
              >
                📦 Number of Products
              </button>
            </div>

            {/* Time Period Filter - Changes based on metric type */}
            {metricType === 'shg' ? (
              <select
                value={shgTimePeriod}
                onChange={(e) => setShgTimePeriod(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-surface)'
                }}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            ) : (
              <select
                value="all"
                disabled
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-surface)',
                  opacity: 0.6,
                  cursor: 'not-allowed'
                }}
              >
                <option value="7" disabled style={{ color: '#999' }}>Last 7 Days</option>
                <option value="30" disabled style={{ color: '#999' }}>Last 30 Days</option>
                <option value="90" disabled style={{ color: '#999' }}>Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            )}

            {/* Download PDF Button */}
            <button
              onClick={() => {
                alert('PDF download will be implemented with backend integration')
                console.log('Downloading PDF for:', metricType, metricType === 'shg' ? shgTimePeriod : 'all')
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid var(--color-primary)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.color = 'var(--color-primary)'
              }}
            >
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Side by Side Layout - Top 10 and Least 10 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Top 10 Column */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🔥 Top 10 {metricType === 'shg' ? 'SHGs' : 'Products'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {metricType === 'shg' 
                ? topSHGInquiries.map((shg, index) => renderListItem(shg, index, false, false))
                : topProductInquiries.map((product, index) => renderListItem(product, index, true, false))
              }
            </div>
          </div>

          {/* Least 10 Column */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📉 Least 10 {metricType === 'shg' ? 'SHGs' : 'Products'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {metricType === 'shg' 
                ? leastSHGInquiries.map((shg, index) => renderListItem(shg, index, false, true))
                : leastProductInquiries.map((product, index) => renderListItem(product, index, true, true))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
