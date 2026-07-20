'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import Link from 'next/link'

interface GradientCardProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  gradient: 'sunset' | 'ocean' | 'mint' | 'sunrise'
  avatars?: string[]
  href?: string
  className?: string
  delay?: number
}

const gradients = {
  sunset: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-500',
  ocean: 'bg-gradient-to-br from-purple-400 via-indigo-400 to-purple-600',
  mint: 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600',
  sunrise: 'bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500',
}

export default function GradientCard({
  title,
  subtitle,
  icon,
  gradient,
  avatars = [],
  href,
  className = '',
  delay = 0,
}: GradientCardProps) {
  const CardContent = (
    <>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              {icon}
            </div>
          )}
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        <h3 className="text-white font-bold text-lg mb-1 leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/80 text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Avatar group */}
      {avatars.length > 0 && (
        <div className="relative z-10 flex -space-x-2">
          {avatars.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="Team member"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
          {avatars.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-white/90 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">
                +{avatars.length - 3}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative ${className}`}
    >
      {href ? (
        <Link href={href}>
          <div
            className={`
              ${gradients[gradient]}
              rounded-xl p-5 cursor-pointer
              transition-all duration-300
              hover:scale-105 hover:shadow-xl
              relative overflow-hidden
              min-h-[140px] flex flex-col justify-between
            `}
          >
            {CardContent}
          </div>
        </Link>
      ) : (
        <div
          className={`
            ${gradients[gradient]}
            rounded-xl p-5
            transition-all duration-300
            hover:scale-105 hover:shadow-xl
            relative overflow-hidden
            min-h-[140px] flex flex-col justify-between
          `}
        >
          {CardContent}
        </div>
      )}
    </motion.div>
  )
}
