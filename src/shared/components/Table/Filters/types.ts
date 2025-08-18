export type FilterOperator = "equals" | "contains" | "in" | "greaterThan" | "lessThan" | "between" | "isTrue" | "isFalse" | "startsWith" | "endsWith"

export type FilterCondition = {
  id: string
  field: string
  operator: FilterOperator
  value: unknown
  isActive?: boolean
}

export type FilterConfig = {
  field: string
  type: "text" | "number" | "date" | "boolean" | "select"
  label: string
  operators: FilterOperator[]
  options?: { value: string; label: string }[]
  placeholder?: string
}
