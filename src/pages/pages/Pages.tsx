import { reatomComponent } from "@reatom/react"
import { useCallback } from "react"

import { Empty } from "@/shared/components/Empty/Empty"
import { Loader } from "@/shared/components/Loader"
import { type Column, Table, editableColkey } from "@/shared/components/Table"
import { Filters } from "@/shared/components/Table/Filters/Filters"
import type { FilterConfig } from "@/shared/components/Table/Filters/types"
import { useFilters } from "@/shared/components/Table/Filters/useFilters"
import { applyFilters } from "@/shared/components/Table/Filters/utils"

import { getPagesAction } from "./api"
import type { Page } from "./types"
import { SIZES } from "./utils"

export const Pages = reatomComponent(() => {
  const data = getPagesAction.data()

  const isFetching = !getPagesAction.ready()

  const editHandler = useCallback((updatedRow: Page) => {
    getPagesAction.data.set((prev) => prev.map((item) => (item.id === updatedRow.id ? updatedRow : item)))
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
    <div className="max-h-[calc(100svh-83px-48px-16px)] min-h-[700px] flex flex-col gap-4 relative">
      <div>
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

      <div className="flex min-h-0">
        {filteredData?.length > 0 || isFetching ? (
          <Table
            className="min-w-[1000px]"
            data={filteredData}
            columns={columns}
            getRowId={({ id }) => id}
            rowsTotalCount={filteredData.length}
            onEdit={editHandler}
            virtualized={{ rowHeight: 58 }}
          />
        ) : (
          <Empty className="w-full" description={filters.length > 0 ? "Try changing your filters" : "No Pages found"} />
        )}
      </div>

      <Loader isLoading={isFetching} />
    </div>
  )
})

const columns: Column<Page>[] = [
  { key: "id", header: "ID", width: 110, grow: false, editable: false },
  { key: "title", header: "Title", editable: (row) => row.active, validation: (value) => (value ? null : "Field is required") },
  { key: "active", header: "Active", render: ({ active }) => (active ? "✅" : "❌"), fieldType: "boolean" },
  { key: "createdAt", header: "Created at", fieldType: "date" },
  { key: "publishedAt", header: "Published at", fieldType: "date" },
  { key: editableColkey, header: "", width: 80, grow: false },
]
