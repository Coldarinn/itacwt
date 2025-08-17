type Props = {
  isLoading?: boolean
  className?: string
}

export const Loader = (props: Props) => {
  const { className = "", isLoading } = props

  if (!isLoading) return null

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn rounded-inherit ${className}`}
    >
      <svg className="animate-spin text-brand-from w-6 h-6" viewBox="0 0 50 50">
        <circle className="text-gray-500/30" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
        <circle
          className="text-brand-from"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="90 150"
          strokeDashoffset="0"
        />
      </svg>
    </div>
  )
}
