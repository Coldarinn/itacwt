import { reatomComponent } from "@reatom/react"

import { Empty } from "@/shared/components/Empty/Empty"
import { Loader } from "@/shared/components/Loader"
import { type Column, Table } from "@/shared/components/Table"

import { getProductsAction } from "./api"
import type { Product } from "./types"
import { sizeComparator } from "./utils"

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

const columns: Column<Product>[] = [
  { key: "id", header: "ID", width: 110, grow: false },
  { key: "name", header: "name" },
  { key: "options.size", header: "size", comparator: sizeComparator },
  { key: "options.amount", header: "amount" },
  { key: "active", header: "Active", render: ({ active }) => (active ? "✅" : "❌") },
  { key: "createdAt", header: "createdAt" },
]
