import { deepGet } from "../utils"
import type { FilterCondition } from "./types"

const clearValue = (v: unknown) => String(v).toLowerCase().trim().replace(" +", " ")

const compareValues = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (a == null || b == null) return false

  return clearValue(a) === clearValue(b)
}

export const applyFilters = <T extends object>(data: T[], filters: FilterCondition[]): T[] => {
  if (!filters.length) return data

  return data.filter((item) => {
    const fieldGroups = filters.reduce(
      (acc, filter) => {
        if (!acc[filter.field]) acc[filter.field] = []
        acc[filter.field].push(filter)
        return acc
      },
      {} as Record<string, FilterCondition[]>
    )

    return Object.entries(fieldGroups).every(([_, fieldFilters]) => {
      return fieldFilters.some((filter) => {
        if (filter.isActive === false) return true

        const fieldValue = deepGet(item, filter.field)

        switch (filter.operator) {
          case "equals":
            return compareValues(fieldValue, filter.value)
          case "contains":
            return clearValue(fieldValue).includes(clearValue(filter.value))
          case "startsWith":
            return clearValue(fieldValue).startsWith(clearValue(filter.value))
          case "endsWith":
            return clearValue(fieldValue).endsWith(clearValue(filter.value))
          case "in":
            return Array.isArray(filter.value) ? filter.value.some((val) => compareValues(val, fieldValue)) : compareValues(fieldValue, filter.value)
          case "greaterThan":
            return Number(fieldValue) > Number(filter.value)
          case "lessThan":
            return Number(fieldValue) < Number(filter.value)
          case "between": {
            if (typeof filter.value !== "object" || filter.value === null) return false

            const { from, to } = filter.value as { from?: string; to?: string }
            const date = new Date(fieldValue as string).getTime()
            return (!from || date >= new Date(from).getTime()) && (!to || date <= new Date(to).getTime())

            // const { from, to } = filter.value as { from?: number | string; to?: number | string }
            // const numValue = Number(fieldValue)
            // return (!from || numValue >= Number(from)) && (!to || numValue <= Number(to))
          }
          case "isTrue":
            return fieldValue === true
          case "isFalse":
            return fieldValue === false
          default:
            return true
        }
      })
    })
  })
}
