import React from 'react'

const AuditLogs = () => {
  const logs = [
    { id: 'AUD001', user: 'Admin User', action: 'Created Super Admin', resource: 'User', timestamp: '2026-02-15 10:30:00' },
    { id: 'AUD002', user: 'Admin User', action: 'Updated Configuration', resource: 'System Config', timestamp: '2026-02-15 09:15:00' },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Audit Logs</h1>
        <p>Track all administrative actions</p>
      </div>

      <div className="dashboard-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.resource}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditLogs
