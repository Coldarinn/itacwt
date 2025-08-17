import { DefaultEmptyImage } from "./DefaultImage"

type Props = {
  description?: string | React.ReactNode
  image?: React.ReactNode
  className?: string
}

export const Empty = (props: Props) => {
  const { description = "Нет данных", image, className = "" } = props

  return (
    <div className={`panel flex flex-col items-center justify-center text-center py-10 px-6 animate-fadeIn ${className}`}>
      <div>{image || <DefaultEmptyImage />}</div>
      <div className="text-slate-300 text-lg">{description}</div>
    </div>
  )
}
