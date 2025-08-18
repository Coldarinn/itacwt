import cls from "classnames"
import { memo, useState } from "react"

import { EditModal } from "./EditModal"
import { editableColkey } from "./constants"
import type { Column, TRecord } from "./types"
import { deepGet, formatValue } from "./utils"

type Props<T extends TRecord> = {
  row: T
  columns: Column<T>[]
  onEdit?: (updatedRow: T) => void
}

const RowComponent = <T extends TRecord>({ row, columns, onEdit }: Props<T>) => {
  const [isEditing, setIsEditing] = useState(false)

  const renderCol = (row: T, index: number, col: Column<T>) =>
    col.render?.(row, index) ?? (
      <span className="truncate">
        {col.fieldType ? formatValue(deepGet(row, col.key) as string, col.fieldType) : String(deepGet(row, col.key) || "—")}
      </span>
    )

  const handleSave = (updatedRow: T) => {
    onEdit?.(updatedRow)
    setIsEditing(false)
  }

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
          {col.key === editableColkey ? (
            <button onClick={() => setIsEditing(true)} className="btn-ghost text-xs">
              Edit
            </button>
          ) : (
            renderCol(row, index, col)
          )}
        </div>
      ))}

      <EditModal row={row} columns={columns} open={isEditing} onClose={() => setIsEditing(false)} onSave={handleSave} />
    </div>
  )
}

export const Row = memo(RowComponent) as typeof RowComponent
