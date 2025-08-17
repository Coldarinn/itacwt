import type { SortDirection, SortState } from "./types"

type Path = string

export const sortData = <T extends object>(rows: T[], sort: SortState | null): T[] => {
  if (!sort?.dir) return [...rows]

  const { path, dir, comparator = defaultComparator } = sort

  return [...rows].sort((a, b) => {
    const valueA = deepGet(a, path)
    const valueB = deepGet(b, path)
    return comparator(valueA, valueB, dir)
  })
}

export const deepGet = <T extends object>(obj: T, path: Path): unknown => {
  if (!path) return obj

  return path.split(".").reduce((acc: unknown, key: string) => {
    if (acc === null || acc === undefined) return undefined
    if (typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

const defaultComparator = (a: unknown, b: unknown, direction: SortDirection): number => {
  if (a == null && b == null) return 0
  if (a == null) return direction === "asc" ? -1 : 1
  if (b == null) return direction === "asc" ? 1 : -1

  if (typeof a === "number" && typeof b === "number") {
    return direction === "asc" ? a - b : b - a
  }

  if (typeof a === "string" || typeof b === "string" || a instanceof Date || b instanceof Date) {
    try {
      const dateA = new Date(a as string | number | Date)
      const dateB = new Date(b as string | number | Date)
      if (!isNaN(dateA.getTime())) {
        return direction === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      }
    } catch {
      // not date
    }
  }

  if (typeof a === "boolean" && typeof b === "boolean") {
    return direction === "asc" ? (a === b ? 0 : a ? 1 : -1) : a === b ? 0 : a ? -1 : 1
  }

  return direction === "asc"
    ? String(a).localeCompare(String(b), undefined, { sensitivity: "base", numeric: true })
    : String(b).localeCompare(String(a), undefined, { sensitivity: "base", numeric: true })
}
