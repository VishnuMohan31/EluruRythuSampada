import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
]

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
    localStorage.setItem('language', currentLanguage)
    document.documentElement.lang = currentLanguage
  }, [currentLanguage, i18n])

  const changeLanguage = (langCode) => {
    const lang = languages.find(l => l.code === langCode)
    if (lang) {
      setCurrentLanguage(langCode)
    }
  }

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    currentLanguageName: languages.find(l => l.code === currentLanguage)?.nativeName || 'English'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
