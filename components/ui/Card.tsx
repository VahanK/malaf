import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-large hover:-translate-y-2 hover:scale-105 cursor-pointer'
    : ''

  return (
    <div
      className={`bg-white rounded-3xl border border-neutral-200 p-8 shadow-soft transition-all duration-300 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
