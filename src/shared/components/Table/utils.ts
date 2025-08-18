import type { FieldType, SortDirection, SortState } from "./types"

export const sortData = <T extends object>(rows: T[], sort: SortState | null): T[] => {
  if (!sort?.dir) return [...rows]

  const { path, dir, comparator = defaultComparator } = sort

  return [...rows].sort((a, b) => {
    const valueA = deepGet(a, path)
    const valueB = deepGet(b, path)
    return comparator(valueA, valueB, dir)
  })
}

export const deepGet = <T extends object>(obj: T, path: string): unknown => {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (acc !== null && typeof acc === "object" && key in acc ? (acc as Record<string, unknown>)[key] : undefined), obj)
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

export const deepSet = <T>(obj: T, path: string, value: unknown): T => {
  const keys = path.split(".")
  let current = obj as Record<string, unknown>
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]] as Record<string, unknown>
  }
  current[keys[keys.length - 1]] = value
  return obj
}

export const formatValue = (value: unknown, type: FieldType) => {
  if (type === "date") return formatDate(value as string)

  if (type === "number") return formatNumber(value as number)

  return value as string
}

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

const formatNumber = (value: number | string) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(+value)
}
