import { useState, useEffect } from 'react'
import { api, logger } from '@/utils/api'
import '../admin/Dashboard.css'

const SuperAdminDashboard = () => {
  const [metricType, setMetricType] = useState('shg') // 'shg' or 'product'
  const [shgTimePeriod, setShgTimePeriod] = useState('30') // For SHG Inquiries
  // Product metrics always use 'all' time period

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSHGs: 0,
    totalContacts: 0,
    totalCategories: 0
  })
  const [topSHGInquiries, setTopSHGInquiries] = useState([])
  const [leastSHGInquiries, setLeastSHGInquiries] = useState([])
  const [topProductInquiries, setTopProductInquiries] = useState([])
  const [leastProductInquiries, setLeastProductInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch stats from API
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      logger.info('Fetching Dashboard Stats', 'analytics/stats')
      
      const data = await api.get('/api/analytics/stats')
      logger.success('Fetched Dashboard Stats', data)
      
      setStats({
        totalProducts: data.totalProducts,
        totalSHGs: data.totalSHGs,
        totalContacts: data.totalContacts,
        totalCategories: data.totalCategories
      })
    } catch (error) {
      logger.error('Fetch Dashboard Stats Failed', error.message)
      setStats({
        totalProducts: 0,
        totalSHGs: 0,
        totalContacts: 0,
        totalCategories: 0
      })
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch metrics data from API
  useEffect(() => {
    fetchMetricsData()
  }, [metricType, shgTimePeriod])

  const fetchMetricsData = async () => {
    try {
      setLoading(true)
      logger.info('Fetching Dashboard Metrics', `type=${metricType}, period=${shgTimePeriod}`)
      
      const data = await api.get(`/api/analytics/metrics?type=${metricType}&period=${shgTimePeriod}`)
      logger.success('Fetched Dashboard Metrics', data)
      
      setTopSHGInquiries(data.topSHGs || [])
      setLeastSHGInquiries(data.leastSHGs || [])
      setTopProductInquiries(data.topProducts || [])
      setLeastProductInquiries(data.leastProducts || [])
    } catch (error) {
      logger.error('Fetch Dashboard Metrics Failed', error.message)
      setTopSHGInquiries([])
      setLeastSHGInquiries([])
      setTopProductInquiries([])
      setLeastProductInquiries([])
    } finally {
      setLoading(false)
    }
  }

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
            <div className="stat-value" style={{ color: '#ffffff', fontFamily: 'inherit', fontWeight: '500' }}>
              {statsLoading ? '...' : stats.totalProducts}
            </div>
            <div className="stat-label" style={{ color: '#ffffff' }}>Total Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏛</div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: '#ffffff', fontFamily: 'inherit', fontWeight: '500' }}>
              {statsLoading ? '...' : stats.totalSHGs}
            </div>
            <div className="stat-label" style={{ color: '#ffffff' }}>SHGs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: '#ffffff', fontFamily: 'inherit', fontWeight: '500' }}>
              {statsLoading ? '...' : stats.totalCategories}
            </div>
            <div className="stat-label" style={{ color: '#ffffff' }}>No. of Categories</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: '#ffffff', fontFamily: 'inherit', fontWeight: '500' }}>
              {statsLoading ? '...' : stats.totalContacts}
            </div>
            <div className="stat-label" style={{ color: '#ffffff' }}>No. of Inquiries</div>
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
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                  Loading...
                </div>
              ) : (metricType === 'shg' ? topSHGInquiries : topProductInquiries).length > 0 ? (
                metricType === 'shg' 
                  ? topSHGInquiries.map((shg, index) => renderListItem(shg, index, false, false))
                  : topProductInquiries.map((product, index) => renderListItem(product, index, true, false))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Least 10 Column */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📉 Least 10 {metricType === 'shg' ? 'SHGs' : 'Products'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                  Loading...
                </div>
              ) : (metricType === 'shg' ? leastSHGInquiries : leastProductInquiries).length > 0 ? (
                metricType === 'shg' 
                  ? leastSHGInquiries.map((shg, index) => renderListItem(shg, index, false, true))
                  : leastProductInquiries.map((product, index) => renderListItem(product, index, true, true))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
