/**
 * Date formatting utilities for consistent dd/mm/yyyy format across the application
 */

/**
 * Format date string to dd/mm/yyyy format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date in dd/mm/yyyy format
 */
export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Format datetime string to dd/mm/yyyy hh:mm:ss AM/PM format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted datetime in dd/mm/yyyy hh:mm:ss AM/PM format
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12
  const hoursStr = String(hours).padStart(2, '0')
  
  return `${day}/${month}/${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`
}

/**
 * Format time only to hh:mm:ss AM/PM format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted time in hh:mm:ss AM/PM format
 */
export const formatTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  hours = hours % 12
  hours = hours ? hours : 12
  const hoursStr = String(hours).padStart(2, '0')
  
  return `${hoursStr}:${minutes}:${seconds} ${ampm}`
}
