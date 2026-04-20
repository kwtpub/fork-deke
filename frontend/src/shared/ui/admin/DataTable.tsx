import { type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './DataTable.module.scss'

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  loading?: boolean
  emptyText?: string
  onRowClick?: (row: T) => void
  getRowKey?: (row: T, index: number) => string | number
}

export const DataTable = <T,>({
  columns,
  rows,
  loading = false,
  emptyText = 'Нет данных',
  onRowClick,
  getRowKey,
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={{ width: c.width, textAlign: c.align ?? 'left' }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skel-${i}`} className={styles.skeletonRow}>
                {columns.map((c) => (
                  <td key={c.key}>
                    <span className={styles.skeletonCell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.empty}>{emptyText}</div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width, textAlign: c.align ?? 'left' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = getRowKey ? getRowKey(row, i) : i
            return (
              <tr
                key={key}
                className={clsx({ [styles.clickable]: Boolean(onRowClick) })}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
