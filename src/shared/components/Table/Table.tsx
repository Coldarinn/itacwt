import { useVirtualizer } from "@tanstack/react-virtual"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Header } from "./Header"
import { Row } from "./Row"
import "./styles.css"
import type { SortState, TRecord, TableProps } from "./types"
import { sortData } from "./utils"

const ROW_HEIGHT = 48
const OVERSCAN = 5

const TableComponent = <T extends TRecord>(props: TableProps<T>) => {
  const {
    data,
    columns,
    getRowId,
    rowsTotalCount,
    sortState: sortStateProp = null,
    onSortChange: onSortChangeProp,
    virtualized,
    onEndReached,
    isLoadingMore = false,
  } = props

  const [sortState, setSortState] = useState<SortState>(sortStateProp || { path: "", dir: null })
  const onSortChange = onSortChangeProp ?? setSortState
  useEffect(() => {
    setSortState(sortStateProp || { path: "", dir: null })
  }, [sortStateProp])

  const sortedData = useMemo(() => sortData(data, sortState), [data, sortState])

  const parentRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  const { getVirtualItems, measureElement, getTotalSize } = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => virtualized?.rowHeight ?? ROW_HEIGHT,
    overscan: virtualized?.overscan ?? OVERSCAN,
    getItemKey: useCallback((index: number) => getRowId(sortedData[index]), [sortedData, getRowId]),
  })

  useEffect(() => {
    if (!observerRef.current || !onEndReached) return

    const observer = new IntersectionObserver(
      (entries) => {
        const bottomItem = entries.find((entry) => entry.isIntersecting)
        if (bottomItem && sortedData.length < rowsTotalCount && !isLoadingMore) onEndReached()
      },
      { root: parentRef.current, threshold: 1, rootMargin: "200px" }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [sortedData.length, onEndReached, isLoadingMore, rowsTotalCount])

  const renderVirtualizedRows = () => {
    const virtualRows = getVirtualItems()

    return (
      <div className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${virtualRows[0]?.start ?? 0}px)` }}>
        {virtualRows.map((vRow) => {
          const row = sortedData[vRow.index]

          return (
            <div key={vRow.key} className="" ref={measureElement}>
              <Row row={row} columns={columns} />
            </div>
          )
        })}
      </div>
    )
  }

  const renderFlatRows = () =>
    sortedData.map((row) => {
      const id = getRowId(row)
      return <Row key={id} row={row} columns={columns} />
    })

  const rows = virtualized ? renderVirtualizedRows() : renderFlatRows()

  return (
    <div ref={parentRef} className="w-full overflow-y-auto bg-inherit">
      <Header columns={columns} sortState={sortState} onSortChange={onSortChange} />

      <div className="relative bg-inherit" style={{ height: virtualized ? getTotalSize() : undefined }}>
        {rows}
      </div>

      <div ref={observerRef} />

      {isLoadingMore && (
        <div className="w-full h-12 flex items-center justify-center my-2">
          <span className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export const Table = memo(TableComponent) as typeof TableComponent
