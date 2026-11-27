import { useEffect, useRef } from 'react'

const AUTO_CLOSE_MS = 3000

type ToastVariant = 'success' | 'error' | 'info'

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
}

interface ToastProps {
  message: string
  variant?: ToastVariant
  onClose: () => void
}

export function Toast({ message, variant = 'info', onClose }: ToastProps) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const timeout = setTimeout(() => onCloseRef.current(), AUTO_CLOSE_MS)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-4 rounded px-4 py-3 text-white shadow-lg ${VARIANT_CLASSES[variant]}`}
    >
      <span>{message}</span>
      <button
        type="button"
        aria-label="Close notification"
        onClick={onClose}
        className="ml-auto rounded px-1 leading-none hover:bg-white/20"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
