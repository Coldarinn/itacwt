import type { SortDirection } from "@/shared/components/Table"

const SIZE_ORDER = ["S", "M", "L", "XL", "XXL"]

export const sizeComparator = (a: unknown, b: unknown, dir: SortDirection): number => {
  const normalize = (size: unknown): string => (typeof size === "string" ? size.toUpperCase().trim() : "")

  const sizeA = normalize(a)
  const sizeB = normalize(b)

  const indexA = SIZE_ORDER.indexOf(sizeA)
  const indexB = SIZE_ORDER.indexOf(sizeB)

  if (indexA >= 0 && indexB >= 0) return dir === "asc" ? indexA - indexB : indexB - indexA

  if (indexA >= 0) return dir === "asc" ? -1 : 1

  if (indexB >= 0) return dir === "asc" ? 1 : -1

  return dir === "asc" ? sizeA.localeCompare(sizeB) : sizeB.localeCompare(sizeA)
}
