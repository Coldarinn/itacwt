import cn from "classnames"
import { NavLink } from "react-router-dom"

const links = [
  { to: "/", label: "Products" },
  { to: "/price-plans", label: "Price Plans" },
  { to: "/pages", label: "Pages" },
]

export const Sidebar = () => {
  return (
    <aside className="bg-[var(--color-panel)] border-r border-[var(--color-border)] p-5">
      <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Pages</h2>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn("block px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors duration-200", {
              "bg-gradient-to-r from-[var(--color-brand-from)] to-[var(--color-brand-to)] text-white font-medium shadow-inner": isActive,
            })
          }
        >
          {label}
        </NavLink>
      ))}
    </aside>
  )
}
