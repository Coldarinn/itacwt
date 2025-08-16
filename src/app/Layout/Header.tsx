type Props = {
  title: string
}

export const Header = (props: Props) => {
  const { title } = props

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-panel)] backdrop-blur-sm">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="flex gap-2">
        <a href="https://telegra.ph/Testovoe-zadanie--UI-interfejs-dlya-upravleniya-dannymi-06-23" target="_blank" rel="noreferrer">
          <button className="btn-ghost">Spec</button>
        </a>
        <a href="https://github.com/" target="_blank" rel="noreferrer">
          <button className="btn-ghost">Repo</button>
        </a>
      </div>
    </div>
  )
}
