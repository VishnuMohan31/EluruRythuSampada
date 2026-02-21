import { useState, useEffect } from 'react'
import { Eye, EyeOff, User, Mail, Phone, Shield } from 'lucide-react'
import Button from '../../components/common/Button'
import { api, logger, showToast } from '../../utils/api'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Edit profile state
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      logger.info('Fetching Profile', 'user profile')
      const data = await api.get('/api/users/me')
      setProfile(data)
      setFullName(data.full_name)
      setMobileNumber(data.mobile_number || '')
      logger.success('Profile Loaded', data.email)
    } catch (error) {
      logger.error('Fetch Profile Failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    try {
      logger.info('Updating Profile', 'name and mobile')
      
      await api.put('/api/users/me', {
        full_name: fullName,
        mobile_number: mobileNumber
      })
      
      logger.success('Profile Updated', 'successfully')
      showToast('Profile updated successfully!', 'success')
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      logger.error('Update Profile Failed', error.message)
      showToast(error.message || 'Failed to update profile', 'error')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error')
      return
    }
    
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long!', 'error')
      return
    }

    try {
      logger.info('Changing Password', 'user password update')
      
      await api.put('/api/users/me/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      
      logger.success('Password Changed', 'successfully')
      showToast('Password changed successfully!', 'success')
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      logger.error('Change Password Failed', error.message)
      showToast(error.message || 'Failed to change password', 'error')
    }
  }

  if (loading) {
    return <div className="dashboard-page"><p>Loading profile...</p></div>
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your account information and security</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Profile Information */}
        <div className="dashboard-card">
          <h3>Profile Information</h3>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Email (Read-only) */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-light)' }}>
                <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-light)' }}>
                <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Role
              </label>
              <input
                type="text"
                value={profile?.role === 'admin' ? 'Administrator' : 'Super Admin'}
                disabled
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Full Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                required
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter mobile number"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {!isEditing ? (
                <Button type="button" variant="primary" onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="primary">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                    setFullName(profile.full_name);
                    setMobileNumber(profile.mobile_number || '');
                  }}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="dashboard-card">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Current Password <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    paddingRight: '2.5rem',
                    border: '2px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text-light)'
                  }}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                New Password <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    paddingRight: '2.5rem',
                    border: '2px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text-light)'
                  }}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Confirm New Password <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    paddingRight: '2.5rem',
                    border: '2px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text-light)'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary">Change Password</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
