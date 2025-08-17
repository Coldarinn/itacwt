import type { SortState } from "./types"

type Path = string

export const sortData = <T extends object>(rows: T[], sort: SortState | null): T[] => {
  if (!sort?.dir) return [...rows]

  const { path, dir } = sort

  return [...rows].sort((a, b) => {
    const valueA = deepGet(a, path)
    const valueB = deepGet(b, path)
    const comparison = compare(valueA, valueB)
    return dir === "asc" ? comparison : -comparison
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

const compare = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  if (typeof a === "number" && typeof b === "number") return a - b

  try {
    const dateA = new Date(a as string | number | Date)
    const dateB = new Date(b as string | number | Date)
    if (!isNaN(dateA.getTime())) {
      return dateA.getTime() - dateB.getTime()
    }
  } catch {
    // not date
  }

  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true,
  })
}
