import { reatomComponent } from "@reatom/react"

import { Empty } from "@/shared/components/Empty/Empty"
import { Loader } from "@/shared/components/Loader"
import { type Column, Table, editableColkey } from "@/shared/components/Table"

import { getProductsAction } from "./api"
import type { Product } from "./types"
import { SIZE_ORDER, sizeComparator } from "./utils"

export const Products = reatomComponent(() => {
  const data = getProductsAction.data()

  const isFetching = !getProductsAction.ready()

  return (
    <div className="p-6">
      <div className="relative">
        {data?.length > 0 || isFetching ? <Table data={data} columns={columns} getRowId={({ id }) => id} rowsTotalCount={data.length} /> : <Empty />}

        <Loader isLoading={isFetching} />
      </div>
    </div>
  )
})

const sizeOptions = SIZE_ORDER.map((item) => ({
  label: item,
  value: item,
}))

const columns: Column<Product>[] = [
  { key: "id", header: "ID", width: 110, grow: false, editable: false },
  { key: "name", header: "name", editable: (row) => row.active },
  { key: "options.size", header: "size", comparator: sizeComparator, fieldType: "select", options: sizeOptions },
  { key: "options.amount", header: "amount", fieldType: "number" },
  { key: "active", header: "Active", render: ({ active }) => (active ? "✅" : "❌"), fieldType: "boolean" },
  { key: "createdAt", header: "createdAt", fieldType: "date" },
  { key: editableColkey, header: "", width: 80, grow: false },
]
