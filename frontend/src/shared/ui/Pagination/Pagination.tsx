import styles from './Pagination.module.scss'
import clsx from 'clsx'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className={styles.pagination}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>
      {pages.map((p) => (
        <button key={p} className={clsx({ [styles.active]: p === page })} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>→</button>
    </div>
  )
}
