import cls from "classnames"
import { useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

import "../styles.css"
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
      className: "input",
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
            <select className="select input" value={String(filter.value)} onChange={(e) => onUpdate(filter.id, { value: e.target.value === "true" })}>
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
              className="input"
              value={(filter.value as { from?: string })?.from || ""}
              onChange={(e) =>
                onUpdate(filter.id, {
                  value: { ...(filter.value as object), from: e.target.value },
                })
              }
            />
            <input
              type="date"
              className="input"
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
          <select className="select input" value={filter.value as string} onChange={(e) => onUpdate(filter.id, { value: e.target.value })}>
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
    <div className={cls("panel mb-4 grid", className, { "gap-4": filters?.length })}>
      <div className="space-y-3">
        {filters.map((filter) => {
          const config = availableFilters.find((f) => f.field === filter.field)
          const availableOperators = config?.operators || []

          return (
            <div key={filter.id} className="flex items-end gap-2">
              {onToggle && (
                <button
                  onClick={() => onToggle(filter.id)}
                  className={cls("btn btn-ghost filters-btn", {
                    "bg-green-500/20! text-green-500!": filter.isActive !== false,
                    "bg-gray-500/20! text-gray-500!": filter.isActive === false,
                  })}
                >
                  {filter.isActive !== false ? "✓" : "✗"}
                </button>
              )}

              <div className="flex-1 grid grid-cols-3 gap-2">
                <select className="select input" value={filter.field} onChange={(e) => handleFieldChange(filter.id, e.target.value)}>
                  {availableFilters.map((f) => (
                    <option key={f.field} value={f.field}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <select
                  className="select input"
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

              <button onClick={() => onRemove(filter.id)} className="btn btn-ghost filters-btn">
                🗑️
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={handleAddFilter} className="btn-ghost btn-primary">
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
