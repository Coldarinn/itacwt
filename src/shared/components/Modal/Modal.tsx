import { type ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

type Props = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
  size?: ModalSize
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
  footer?: ReactNode
  className?: string
  style?: React.CSSProperties
  testId?: string
  level?: number
  lockBodyScroll?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
}

let openModalsCount = 0

export const Modal = (props: Props) => {
  const {
    open,
    onClose,
    title,
    children,
    size = "md",
    closeOnOverlayClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    footer,
    className = "",
    style,
    testId,
    level,
    lockBodyScroll = true,
  } = props

  const modalRef = useRef<HTMLDivElement>(null)
  const currentLevel = level ?? openModalsCount

  useEffect(() => {
    if (open) {
      openModalsCount++

      return () => {
        openModalsCount--
      }
    }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEsc || currentLevel !== openModalsCount - 1) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, closeOnEsc, onClose, currentLevel])

  useEffect(() => {
    if (!lockBodyScroll) return

    if (open && currentLevel === 0) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      if (currentLevel === 0) {
        document.body.style.overflow = ""
      }
    }
  }, [open, currentLevel, lockBodyScroll])

  if (!open) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && currentLevel === openModalsCount - 1) onClose()
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ zIndex: 50 + currentLevel * 10 }}
      data-testid={testId}
    >
      <div
        className="fixed inset-0 transition-opacity"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.5 + currentLevel * 0.1})`,
        }}
        aria-hidden="true"
        onClick={handleOverlayClick}
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`relative w-full transform overflow-hidden rounded-2xl bg-[var(--color-panel)] text-left shadow-xl transition-all ${sizeClasses[size]} ${className}`}
          style={{
            ...style,
            transform: `scale(${1 - currentLevel * 0.03})`,
            boxShadow: `0 0 0 ${currentLevel}px rgba(0,0,0,0.1)`,
          }}
          onKeyDown={(e) => e.key === "Escape" && closeOnEsc && currentLevel === openModalsCount - 1 && onClose()}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold leading-6">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="p-4">{children}</div>

          {footer && <div className="flex justify-end gap-3 border-t border-[var(--color-border)] p-4">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  )
}
