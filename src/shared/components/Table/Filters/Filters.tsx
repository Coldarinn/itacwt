import { useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

import type { FilterCondition, FilterConfig, FilterOperator } from "./types"

type FiltersProps = {
  filters: FilterCondition[]
  availableFilters: FilterConfig[]
  onAdd: (filter: FilterCondition) => void
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void
  onRemove: (id: string) => void
  onReset: () => void
  onToggle?: (id: string, isActive?: boolean) => void
  className?: string
  addButtonText?: string
  resetButtonText?: string
}

export const Filters = (props: FiltersProps) => {
  const {
    filters,
    availableFilters,
    onAdd,
    onUpdate,
    onRemove,
    onReset,
    onToggle,
    className = "",
    addButtonText = "+ Add filter",
    resetButtonText = "Reset filters",
  } = props

  const handleAddFilter = useCallback(() => {
    const firstField = availableFilters[0]?.field
    if (!firstField) return

    const config = availableFilters.find((f) => f.field === firstField)
    onAdd({
      id: uuidv4(),
      field: firstField,
      operator: config?.operators[0] || "equals",
      value: config?.type === "select" && config.options?.[0]?.value ? config.options[0].value : "",
      isActive: true,
    })
  }, [availableFilters, onAdd])

  const handleFieldChange = useCallback(
    (id: string, field: string) => {
      const config = availableFilters.find((f) => f.field === field)
      if (!config) return

      onUpdate(id, {
        field,
        operator: config.operators[0],
        value: config.type === "select" && config.options?.[0]?.value ? config.options[0].value : "",
      })
    },
    [availableFilters, onUpdate]
  )

  const getInputPlaceholder = (config: FilterConfig) => {
    return config.placeholder || `Enter ${config.label.toLowerCase()}...`
  }

  const renderValueInput = (filter: FilterCondition) => {
    const config = availableFilters.find((f) => f.field === filter.field)
    if (!config) return null

    const commonProps = {
      className: "w-full p-2 bg-white/5 border border-white/10 rounded",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onUpdate(filter.id, { value: e.target.value }),
    }

    switch (config.type) {
      case "text":
        return <input type="text" placeholder={getInputPlaceholder(config)} value={filter.value as string} {...commonProps} />
      case "number":
        return <input type="number" placeholder={getInputPlaceholder(config)} value={filter.value as number} {...commonProps} />
      case "boolean":
        return (
          !["isTrue", "isFalse"].includes(filter.operator) && (
            <select
              className="p-2 bg-white/5 border border-white/10 rounded"
              value={String(filter.value)}
              onChange={(e) => onUpdate(filter.id, { value: e.target.value === "true" })}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )
        )
      case "date":
        return filter.operator === "between" ? (
          <div className="flex gap-2">
            <input
              type="date"
              className="p-2 bg-white/5 border border-white/10 rounded"
              value={(filter.value as { from?: string })?.from || ""}
              onChange={(e) =>
                onUpdate(filter.id, {
                  value: { ...(filter.value as object), from: e.target.value },
                })
              }
            />
            <input
              type="date"
              className="p-2 bg-white/5 border border-white/10 rounded"
              value={(filter.value as { to?: string })?.to || ""}
              onChange={(e) =>
                onUpdate(filter.id, {
                  value: { ...(filter.value as object), to: e.target.value },
                })
              }
            />
          </div>
        ) : (
          <input type="date" value={filter.value as string} {...commonProps} />
        )
      case "select":
        return (
          <select
            className="p-2 bg-white/5 border border-white/10 rounded"
            value={filter.value as string}
            onChange={(e) => onUpdate(filter.id, { value: e.target.value })}
          >
            <option value="">Select an option</option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      default:
        return null
    }
  }

  return (
    <div className={`panel mb-4 animate-fadeIn ${className}`}>
      <div className="space-y-3">
        {filters.map((filter) => {
          const config = availableFilters.find((f) => f.field === filter.field)
          const availableOperators = config?.operators || []

          return (
            <div key={filter.id} className="flex items-end gap-3">
              {onToggle && (
                <button
                  onClick={() => onToggle(filter.id)}
                  className={`p-2 rounded ${filter.isActive !== false ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}
                >
                  {filter.isActive !== false ? "✓" : "✗"}
                </button>
              )}

              <div className="flex-1 grid grid-cols-3 gap-2">
                <select
                  className="p-2 bg-white/5 border border-white/10 rounded"
                  value={filter.field}
                  onChange={(e) => handleFieldChange(filter.id, e.target.value)}
                >
                  {availableFilters.map((f) => (
                    <option key={f.field} value={f.field}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 bg-white/5 border border-white/10 rounded"
                  value={filter.operator}
                  onChange={(e) => onUpdate(filter.id, { operator: e.target.value as FilterOperator })}
                >
                  {availableOperators.map((op) => (
                    <option key={op} value={op}>
                      {op.replace(/([A-Z])/g, " $1").trim()}
                    </option>
                  ))}
                </select>

                {renderValueInput(filter)}
              </div>

              <button onClick={() => onRemove(filter.id)} className="btn-ghost p-2 hover:text-red-500" aria-label="Remove filter">
                🗑️
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleAddFilter} className="btn-primary">
          {addButtonText}
        </button>
        {filters.length > 0 && (
          <button onClick={onReset} className="btn-ghost">
            {resetButtonText}
          </button>
        )}
      </div>
    </div>
  )
}
