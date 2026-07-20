'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface TaskListItemProps {
  id: string
  title: string
  description: string
  icon?: string
  iconBg?: string
  teamMembers?: { id: string; name: string; avatar?: string }[]
  href?: string
  delay?: number
}

export default function TaskListItem({
  id,
  title,
  description,
  icon,
  iconBg = 'bg-purple-500',
  teamMembers = [],
  href,
  delay = 0,
}: TaskListItemProps) {
  const Component = href ? Link : 'div'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Component
        href={href || '#'}
        className="block group"
      >
        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
          {/* Icon */}
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            {icon ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {title}
            </h4>
            <p className="text-sm text-gray-500 truncate">
              {description}
            </p>
          </div>

          {/* Team members */}
          {teamMembers.length > 0 && (
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden"
                  title={member.name}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-white">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
              {teamMembers.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">
                    +{teamMembers.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Component>
    </motion.div>
  )
}
