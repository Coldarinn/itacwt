import type { ReactNode } from "react"

export type TRecord = Record<string, unknown>

export type SortDirection = "asc" | "desc" | null
export type SortState = { path: string; dir: SortDirection; comparator?: (a: unknown, b: unknown, direction: SortDirection) => number }

export type FieldType = "text" | "number" | "boolean" | "date" | "select"

type EditableConfig<T extends TRecord> = {
  editable?: boolean | ((row: T) => boolean)
  fieldType?: FieldType
  options?: { value: string; label: string }[]
  validation?: (value: unknown) => string | null
}

export type Column<T extends TRecord> = {
  key: string
  header: ReactNode
  width?: string | number
  sortable?: boolean
  comparator?: (a: unknown, b: unknown, direction: SortDirection) => number
  align?: "left" | "center" | "right"
  sticky?: boolean
  grow?: boolean
  render?: (row: T, index: number) => ReactNode
} & EditableConfig<T>

export type TableProps<T extends TRecord> = {
  data: T[]
  columns: Column<T>[]
  getRowId: (row: T) => number | string
  rowsTotalCount: number

  sortState?: SortState
  onSortChange?: (s: SortState) => void

  onEdit?: (updatedRow: T) => void

  virtualized?: {
    rowHeight?: number
    overscan?: number
  }
  onEndReached?: () => void
  isLoadingMore?: boolean
}
