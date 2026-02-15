import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: 'Welcome to Swayam Eluru Market Place',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      apply: 'Apply',
      
      // Navigation
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      
      // Product
      viewDetails: 'View Details',
      contactVendor: 'Contact Vendor',
      productName: 'Product Name',
      category: 'Category',
      tribe: 'Tribe',
      description: 'Description',
      views: 'Views',
      
      // More translations will be added
    },
  },
  te: {
    translation: {
      // Common
      welcome: 'ట్రైబ్స్ ఇండియా మార్కెట్‌ప్లేస్‌కు స్వాగతం',
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం సంభవించింది',
      success: 'విజయవంతం',
      cancel: 'రద్దు చేయండి',
      save: 'సేవ్ చేయండి',
      delete: 'తొలగించండి',
      edit: 'సవరించండి',
      view: 'చూడండి',
      search: 'వెతకండి',
      filter: 'ఫిల్టర్',
      clear: 'క్లియర్',
      apply: 'వర్తింపజేయండి',
      
      // Navigation
      home: 'హోమ్',
      products: 'ఉత్పత్తులు',
      about: 'గురించి',
      contact: 'సంప్రదించండి',
      login: 'లాగిన్',
      logout: 'లాగౌట్',
      dashboard: 'డాష్‌బోర్డ్',
      
      // Product
      viewDetails: 'వివరాలు చూడండి',
      contactVendor: 'విక్రేతను సంప్రదించండి',
      productName: 'ఉత్పత్తి పేరు',
      category: 'వర్గం',
      tribe: 'తెగ',
      description: 'వివరణ',
      views: 'వీక్షణలు',
      
      // More translations will be added
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
