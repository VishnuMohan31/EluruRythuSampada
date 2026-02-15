import React from 'react'
import './Card.css'

const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export default Card
