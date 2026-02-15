import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    }
    
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isSuperAdmin = () => {
    return user?.role === 'super_admin'
  }

  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isSuperAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
