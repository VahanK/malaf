'use client'

import { useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface InfoButtonProps {
  content: string
  title?: string
}

export default function InfoButton({ content, title }: InfoButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="text-gray-400 hover:text-gray-600 transition-colors ml-1.5"
        aria-label="More information"
      >
        <InformationCircleIcon className="w-4 h-4" />
      </button>

      {showTooltip && (
        <div className="absolute z-50 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 -right-2 top-6 animate-in fade-in slide-in-from-top-1">
          <div className="absolute -top-1 right-3 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45" />
          {title && (
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              {title}
            </h4>
          )}
          <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  )
}
