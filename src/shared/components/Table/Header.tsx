import cls from "classnames"
import { memo } from "react"

import type { Column, SortState, TRecord } from "./types"

type Props<T extends TRecord> = {
  columns: Column<T>[]
  sortState: SortState | null
  onSortChange?: (s: SortState) => void
}

const HeaderComponent = <T extends TRecord>(props: Props<T>) => {
  const { columns, sortState, onSortChange } = props

  const handleSort = (col: Column<T>) => {
    if (col.sortable === false || !onSortChange) return

    let dir: SortState["dir"] = "asc"
    if (sortState?.path === col.key) {
      if (sortState.dir === "asc") dir = "desc"
      else if (sortState.dir === "desc") dir = null
    }

    onSortChange({ path: col.key, dir })
  }

  return (
    <div className="flex w-full sticky-header border-b table-border">
      {columns.map((col, index) => {
        const isSorting = sortState?.path === col.key && sortState?.dir

        return (
          <button
            key={typeof col.header === "string" ? col.header : `${index}-${String(col.key)}`}
            className={cls("cell gap-1 font-semibold text-slate-200", {
              sticky: col.sticky,
              "cursor-pointer": col.sortable !== false,
            })}
            style={{
              width: col.width || 0,
              textAlign: col.align || "left",
              flexGrow: col.grow || col.grow === undefined ? 1 : 0,
            }}
            onClick={() => handleSort(col)}
          >
            {typeof col.header === "string" ? <span className="truncate">{col.header}</span> : col.header}
            {isSorting && <span>{sortState?.dir === "asc" ? "▲" : "▼"}</span>}
          </button>
        )
      })}
    </div>
  )
}

export const Header = memo(HeaderComponent) as typeof HeaderComponent
