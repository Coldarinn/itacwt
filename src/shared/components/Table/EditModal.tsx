import { type SelectHTMLAttributes, useState } from "react"

import { Modal } from "@/shared/components/Modal"

import { editableColkey } from "./constants"
import type { Column, TRecord } from "./types"
import { deepGet, deepSet } from "./utils"

type EditModalProps<T extends TRecord> = {
  row: T
  columns: Column<T>[]
  onSave: (updatedRow: T) => void
  open: boolean
  onClose: () => void
}

export const EditModal = <T extends TRecord>({ row, columns, onSave, open, onClose }: EditModalProps<T>) => {
  const [data, setData] = useState<T>({ ...row })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (path: string, value: unknown) => {
    setData((prev) => {
      const newData = { ...prev }
      deepSet(newData, path, value)
      return newData
    })
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    columns.forEach((col) => {
      if (col.validation) {
        const value = deepGet(data, col.key)
        const error = col.validation(value)
        if (error) newErrors[col.key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(data)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Row"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-ghost btn-primary">
            Save
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {columns
          .filter((col) => col.editable !== false)
          .map((col) => {
            const isEditable = typeof col.editable === "function" ? col.editable(row) : col.editable !== false

            if (!isEditable || col.key === editableColkey) return null

            const value = deepGet(data, col.key)
            const error = errors[col.key]

            return (
              <div key={col.key}>
                <label className="block text-sm text-slate-300 mb-1">{typeof col.header === "string" ? col.header : col.key}</label>
                {renderField(col, value, handleChange)}
                {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
              </div>
            )
          })}
      </div>
    </Modal>
  )
}

const renderField = <T extends TRecord>(col: Column<T>, value: unknown, onChange: (path: string, value: unknown) => void) => {
  const fieldType = col.fieldType || (typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "text")

  switch (fieldType) {
    case "number":
      return (
        <input
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => onChange(col.key, e.target.valueAsNumber)}
          className="w-full bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2"
        />
      )
    case "boolean":
      return (
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(col.key, e.target.checked)}
            className="rounded border-[var(--color-border)]"
          />
          <span>{value ? "Yes" : "No"}</span>
        </label>
      )
    case "select":
      return (
        <select
          value={value as SelectHTMLAttributes<HTMLSelectElement>["value"]}
          onChange={(e) => onChange(col.key, e.target.value)}
          className="w-full bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2"
        >
          {col.options?.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900 text-white">
              {option.label}
            </option>
          ))}
        </select>
      )
    case "date":
      return (
        <input
          type="date"
          value={new Date((value || "") as string).toISOString().split("T")[0]}
          onChange={(e) => onChange(col.key, e.target.value)}
          className="w-full bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2"
        />
      )
    default:
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(col.key, e.target.value)}
          className="w-full bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2"
        />
      )
  }
}
