import cls from "classnames"
import { memo } from "react"

import type { Column, TRecord } from "./types"
import { deepGet } from "./utils"

type Props<T extends TRecord> = {
  row: T
  columns: Column<T>[]
}

const RowComponent = <T extends TRecord>({ row, columns }: Props<T>) => {
  return (
    <div className="flex w-full border-b table-border row-hover">
      {columns.map((col, index) => (
        <div
          key={typeof col.header === "string" ? col.header : `${index}-${String(col.key)}`}
          className={cls("cell", { sticky: col.sticky })}
          style={{
            width: col.width || 0,
            textAlign: col.align || "left",
            flexGrow: col.grow || col.grow === undefined ? 1 : 0,
          }}
        >
          {col.render?.(row, index) ?? <span className="truncate">{String(deepGet(row, col.key)) || "—"}</span>}
        </div>
      ))}
    </div>
  )
}

export const Row = memo(RowComponent) as typeof RowComponent
