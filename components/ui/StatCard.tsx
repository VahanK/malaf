'use client'

import { ReactNode } from 'react'
import InfoButton from './InfoButton'

interface StatCardProps {
  title: string
  description: string
  icon: ReactNode
  action?: {
    label: string
    href: string
  }
  info?: string
  infoTitle?: string
  gradient?: 'purple' | 'blue' | 'emerald' | 'amber'
}

export default function StatCard({
  title,
  description,
  icon,
  action,
  info,
  infoTitle,
  gradient = 'purple'
}: StatCardProps) {
  const gradients = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600'
  }

  const bgColors = {
    purple: 'bg-purple-50',
    blue: 'bg-blue-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50'
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`${bgColors[gradient]} p-2.5 rounded-lg`}>
          <div className={`bg-gradient-to-br ${gradients[gradient]} p-2 rounded-lg`}>
            {icon}
          </div>
        </div>
        {info && <InfoButton content={info} title={infoTitle} />}
      </div>

      <h3 className="font-bold text-gray-900 text-base mb-1.5 flex items-center">
        {title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {description}
      </p>

      {action && (
        <a
          href={action.href}
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          {action.label}
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  )
}
