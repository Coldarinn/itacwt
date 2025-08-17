type Props = {
  title: string
}

export const Header = (props: Props) => {
  const { title } = props

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-panel)] backdrop-blur-sm">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <a href="https://github.com/Coldarinn/itacwt" target="_blank" rel="noreferrer">
        <button className="btn-ghost">Repo</button>
      </a>
    </div>
  )
}
