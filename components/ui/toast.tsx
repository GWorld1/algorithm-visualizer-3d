"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export interface ToastState {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

// Toast context
const ToastContext = React.createContext<ToastState | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [removeToast])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast container
function ToastContainer({ 
  toasts, 
  onRemove 
}: { 
  toasts: ToastProps[]
  onRemove: (id: string) => void 
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  )
}

// Individual toast component
function Toast({ 
  title, 
  description, 
  type = 'info', 
  onClose 
}: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
    info: 'bg-blue-600 border-blue-500',
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
        colors[type],
        "text-white"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        {title && (
          <div className="text-sm font-semibold leading-none tracking-tight">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-90">
            {description}
          </div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Utility functions for common toast types
export const toast = {
  success: (title: string, description?: string) => {
    // This will be implemented when we have the context available
    console.log('Success:', title, description)
  },
  error: (title: string, description?: string) => {
    console.log('Error:', title, description)
  },
  warning: (title: string, description?: string) => {
    console.log('Warning:', title, description)
  },
  info: (title: string, description?: string) => {
    console.log('Info:', title, description)
  },
}
