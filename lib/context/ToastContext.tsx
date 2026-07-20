'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string, duration: number = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: Toast = { id, type, message, duration }

    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    addToast('success', message, duration)
  }, [addToast])

  const showError = useCallback((message: string, duration?: number) => {
    addToast('error', message, duration)
  }, [addToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    addToast('info', message, duration)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, showSuccess, showError, showInfo, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
