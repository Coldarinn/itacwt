import type { ReactNode } from "react"

type Props = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
}

export const Modal = (props: Props) => {
  const { open, onClose, title, children } = props

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onMouseDown={onClose}>
      <div
        className="w-[min(720px,92vw)] bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">{title}</div>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
