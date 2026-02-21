import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@context/AuthContext'
import { ThemeProvider } from '@context/ThemeContext'
import { LanguageProvider } from '@context/LanguageContext'
import { ToastProvider, useToast } from '@components/common/ToastContainer'
import { setToastCallback } from '@/utils/api'
import AppRoutes from './routes'

function AppContent() {
  const { showToast } = useToast()
  
  useEffect(() => {
    setToastCallback(showToast)
  }, [showToast])
  
  return <AppRoutes />
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
