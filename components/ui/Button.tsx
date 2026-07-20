import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-medium'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 hover:scale-105 hover:shadow-colored active:scale-95 font-semibold',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:from-secondary-700 hover:to-secondary-600 hover:scale-105 hover:shadow-medium active:scale-95 font-semibold',
    outline: 'border-2 border-primary-600 text-primary-700 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-800 hover:scale-105 active:scale-95 font-semibold',
    ghost: 'text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 hover:scale-105 active:scale-95 font-medium',
    gradient: 'bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white hover:shadow-colored-lg hover:scale-105 active:scale-95 bg-200 animate-gradient font-semibold'
  }

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
    xl: 'px-12 py-5 text-xl'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
