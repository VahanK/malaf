'use client'

import { motion } from 'framer-motion'

interface ScheduleCardProps {
  title: string
  time: string
  duration?: string
  type?: 'call' | 'meeting' | 'event'
  participants?: { id: string; name: string; avatar?: string }[]
  onJoin?: () => void
  delay?: number
}

export default function ScheduleCard({
  title,
  time,
  duration,
  type = 'meeting',
  participants = [],
  onJoin,
  delay = 0,
}: ScheduleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl p-4 text-white shadow-md"
    >
      {/* Time badge */}
      <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium mb-3">
        {time} {duration && `• ${duration}`}
      </div>

      {/* Title */}
      <h4 className="font-bold text-lg mb-3">{title}</h4>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Participants */}
        {participants.length > 0 && (
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((participant) => (
              <div
                key={participant.id}
                className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden"
                title={participant.name}
              >
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-700">
                    {participant.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-white/90 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">
                  +{participants.length - 3}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onJoin && (
            <button
              onClick={onJoin}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
              title="Join call"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          )}

          <button
            className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
            title="More options"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
