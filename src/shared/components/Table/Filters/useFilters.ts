import { useCallback, useMemo, useState } from "react"

import type { FilterCondition } from "./types"

export const useFilters = (initialFilters: FilterCondition[] = []) => {
  const [filters, setFilters] = useState<FilterCondition[]>([])

  const activeFilters = useMemo(() => filters.filter((filter) => filter.isActive !== false), [filters])

  const addFilter = useCallback((newFilter: FilterCondition | FilterCondition[]) => {
    setFilters((prev) => [...prev, ...(Array.isArray(newFilter) ? newFilter : [newFilter])])
  }, [])

  const updateFilter = useCallback((id: string, updates: Partial<FilterCondition>) => {
    setFilters((prev) => prev.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter)))
  }, [])

  const removeFilter = useCallback((id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const toggleFilter = useCallback((id: string, isActive?: boolean) => {
    setFilters((prev) => prev.map((filter) => (filter.id === id ? { ...filter, isActive: isActive ?? !filter.isActive } : filter)))
  }, [])

  const resetFilters = useCallback(() => setFilters(initialFilters), [initialFilters])

  return {
    filters,
    activeFilters,
    addFilter,
    updateFilter,
    removeFilter,
    resetFilters,
    toggleFilter,
    setFilters,
  }
}
