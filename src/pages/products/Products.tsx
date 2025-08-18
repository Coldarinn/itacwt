import { reatomComponent } from "@reatom/react"
import { useCallback } from "react"

import { Empty } from "@/shared/components/Empty/Empty"
import { Loader } from "@/shared/components/Loader"
import { type Column, Table, editableColkey } from "@/shared/components/Table"
import { Filters } from "@/shared/components/Table/Filters/Filters"
import type { FilterConfig } from "@/shared/components/Table/Filters/types"
import { useFilters } from "@/shared/components/Table/Filters/useFilters"
import { applyFilters } from "@/shared/components/Table/Filters/utils"

import { getProductsAction } from "./api"
import type { Product } from "./types"
import { SIZES, sizeComparator } from "./utils"

export const Products = reatomComponent(() => {
  const data = getProductsAction.data()

  const isFetching = !getProductsAction.ready()

  const editHandler = useCallback((updatedRow: Product) => {
    getProductsAction.data.set((prev) => prev.map((item) => (item.id === updatedRow.id ? updatedRow : item)))
  }, [])

  const { filters, activeFilters, addFilter, updateFilter, removeFilter, resetFilters, toggleFilter } = useFilters()

  const filteredData = applyFilters(data || [], activeFilters)

  const availableFilters: FilterConfig[] = [
    {
      field: "name",
      type: "text",
      label: "Name",
      operators: ["contains", "equals", "startsWith", "endsWith"],
      placeholder: "Search by name...",
    },
    {
      field: "options.size",
      type: "select",
      label: "Size",
      operators: ["equals"],
      options: SIZES.map((size) => ({ label: size, value: size })),
    },
    {
      field: "options.amount",
      type: "number",
      label: "Amount",
      operators: ["equals", "greaterThan", "lessThan", "between"],
    },
    {
      field: "active",
      type: "boolean",
      label: "Active",
      operators: ["isTrue", "isFalse"],
    },
    {
      field: "createdAt",
      type: "date",
      label: "Creation Date",
      operators: ["between"],
    },
  ]

  return (
    <div className="p-6 max-h-[calc(100svh-83px-48px)] flex flex-col">
      <div className="mb-4">
        <Filters
          filters={filters}
          availableFilters={availableFilters}
          onAdd={addFilter}
          onUpdate={updateFilter}
          onRemove={removeFilter}
          onReset={resetFilters}
          onToggle={toggleFilter}
        />
      </div>

      <div className="relative flex-1">
        {filteredData?.length > 0 || isFetching ? (
          <Table
            data={filteredData}
            columns={columns}
            getRowId={({ id }) => id}
            rowsTotalCount={filteredData.length}
            onEdit={editHandler}
            virtualized={{ rowHeight: 58 }}
          />
        ) : (
          <Empty description={filters.length > 0 ? "Try changing your filters" : "No products found"} />
        )}

        <Loader isLoading={isFetching} />
      </div>
    </div>
  )
})

const sizeOptions = SIZES.map((item) => ({
  label: item,
  value: item,
}))

const columns: Column<Product>[] = [
  { key: "id", header: "ID", width: 110, grow: false, editable: false },
  { key: "name", header: "name", editable: (row) => row.active, validation: (value) => (value ? null : "Field is required") },
  { key: "options.size", header: "size", comparator: sizeComparator, fieldType: "select", options: sizeOptions },
  { key: "options.amount", header: "amount", fieldType: "number" },
  { key: "active", header: "Active", render: ({ active }) => (active ? "✅" : "❌"), fieldType: "boolean" },
  { key: "createdAt", header: "createdAt", fieldType: "date" },
  { key: editableColkey, header: "", width: 80, grow: false },
]
