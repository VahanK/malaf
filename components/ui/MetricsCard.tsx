'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MetricsCardProps {
  title: string
  status?: string
  metrics: {
    label: string
    value: string | number
    color?: string
  }[]
  teamMembers?: { id: string; name: string; avatar?: string }[]
  actions?: ReactNode
  delay?: number
}

export default function MetricsCard({
  title,
  status,
  metrics,
  teamMembers = [],
  actions,
  delay = 0,
}: MetricsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          {status && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-500">{status}</span>
            </div>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.color || 'text-gray-900'}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Team Members */}
      {teamMembers.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Team members</p>
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden"
                title={member.name}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {teamMembers.length > 5 && (
              <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">
                  +{teamMembers.length - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
