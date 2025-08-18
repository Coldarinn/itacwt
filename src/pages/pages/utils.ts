import type { SortDirection } from "@/shared/components/Table"

export const SIZES = ["S", "M", "L", "XL", "XXL"]

export const sizeComparator = (a: unknown, b: unknown, dir: SortDirection): number => {
  const normalize = (size: unknown): string => (typeof size === "string" ? size.toUpperCase().trim() : "")

  const sizeA = normalize(a)
  const sizeB = normalize(b)

  const indexA = SIZES.indexOf(sizeA)
  const indexB = SIZES.indexOf(sizeB)

  if (indexA >= 0 && indexB >= 0) return dir === "asc" ? indexA - indexB : indexB - indexA

  if (indexA >= 0) return dir === "asc" ? -1 : 1

  if (indexB >= 0) return dir === "asc" ? 1 : -1

  return dir === "asc" ? sizeA.localeCompare(sizeB) : sizeB.localeCompare(sizeA)
}
