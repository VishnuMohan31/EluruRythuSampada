import { useState, useRef, useEffect } from 'react'
import './CustomSelect.css'

const CustomSelect = ({ name, value, onChange, options, placeholder = "Select...", className = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } })
    setIsOpen(false)
    setSearchTerm('')
  }

  const selectedOption = options.find(opt => opt.value === value)

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`custom-select ${className} ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg 
          className={`custom-select-arrow ${isOpen ? 'open' : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && !disabled && (
        <div className="custom-select-dropdown">
          {/* Search input */}
          {options.length > 5 && (
            <div className="custom-select-search">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          )}
          
          {/* Options list */}
          <div className="custom-select-options-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="custom-select-option" style={{ color: '#999', cursor: 'default' }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
