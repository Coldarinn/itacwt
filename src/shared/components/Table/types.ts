import type { ReactNode } from "react"

export type TRecord = Record<string, unknown>

export type SortDirection = "asc" | "desc" | null
export type SortState = { path: string; dir: SortDirection; comparator?: (a: unknown, b: unknown, direction: SortDirection) => number }

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
  editable?: (row: T) => boolean
}

export type TableProps<T extends TRecord> = {
  data: T[]
  columns: Column<T>[]
  getRowId: (row: T) => number | string
  rowsTotalCount: number

  sortState?: SortState
  onSortChange?: (s: SortState) => void

  virtualized?: {
    rowHeight?: number
    overscan?: number
  }
  onEndReached?: () => void
  isLoadingMore?: boolean
}
