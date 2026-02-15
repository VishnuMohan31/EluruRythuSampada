import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@context/AuthContext'
import { ThemeProvider } from '@context/ThemeContext'
import { LanguageProvider } from '@context/LanguageContext'
import AppRoutes from './routes'

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
