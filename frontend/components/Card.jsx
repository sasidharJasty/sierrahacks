import React from 'react'

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/90 dark:bg-gray-800/60 shadow-md rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
