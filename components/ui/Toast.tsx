'use client'

import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useToast, type Toast as ToastType } from '@/lib/context/ToastContext'

interface ToastProps {
  toast: ToastType
}

function Toast({ toast }: ToastProps) {
  const { dismissToast } = useToast()
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const interval = 50 // Update every 50ms
      const decrement = (interval / toast.duration) * 100

      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - decrement
          if (newProgress <= 0) {
            clearInterval(timer)
            return 0
          }
          return newProgress
        })
      }, interval)

      return () => clearInterval(timer)
    }
  }, [toast.duration])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      dismissToast(toast.id)
    }, 300) // Match animation duration
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-600'
      case 'error':
        return 'bg-red-600'
      case 'info':
        return 'bg-blue-600'
    }
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border-2 shadow-lg min-w-[320px] max-w-[420px]
        transition-all duration-300 ease-out cursor-pointer
        ${getStyles()}
        ${isExiting ? 'translate-x-[500px] opacity-0' : 'translate-x-0 opacity-100'}
      `}
      onClick={handleDismiss}
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200/30">
          <div
            className={`h-full transition-all ease-linear ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <p className="flex-1 text-sm font-medium leading-relaxed pr-2">{toast.message}</p>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  )
}
