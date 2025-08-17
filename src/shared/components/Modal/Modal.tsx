import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react"
import { createPortal } from "react-dom"

type Props = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
  footer?: ReactNode
  className?: string
}

let openModalsCount = 0

export const Modal = (props: Props) => {
  const { open, onClose, title, children, closeOnOverlayClick = true, closeOnEsc = true, showCloseButton = true, footer, className = "" } = props

  const modalRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (open) {
      openModalsCount++

      return () => {
        openModalsCount--
      }
    }
  }, [open])

  const currentLevel = useRef(openModalsCount).current

  useEffect(() => {
    if (!open || !closeOnEsc || currentLevel !== openModalsCount - 1) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, closeOnEsc, onClose, currentLevel])

  useLayoutEffect(() => {
    if (open && currentLevel === 0) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      if (currentLevel === 0) {
        document.body.style.overflow = ""
      }
    }
  }, [open, currentLevel])

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
          className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[var(--color-bg)] text-left shadow-xl transition-all ${className}`}
          style={{
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
                <button className="btn" onClick={onClose} aria-label="Close modal">
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
