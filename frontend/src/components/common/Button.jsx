import React from 'react'
import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClass = `
    btn
    btn-${variant}
    btn-${size}
    ${fullWidth ? 'btn-full-width' : ''}
    ${loading ? 'btn-loading' : ''}
    ${disabled ? 'btn-disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
