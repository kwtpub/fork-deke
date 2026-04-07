import { useEffect, useState } from 'react'
import { ProductCard, productApi } from '@entities/product'
import type { Product, ProductListParams } from '@entities/product'
import { Spinner } from '@shared/ui/Spinner/Spinner'
import { Pagination } from '@shared/ui/Pagination/Pagination'
import styles from './ProductGrid.module.scss'

interface ProductGridProps { params?: ProductListParams; title?: string }

export const ProductGrid = ({ params, title }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    productApi.getList({ ...params, page }).then((res) => {
      setProducts(res.data)
      setTotalPages(res.meta.totalPages)
    }).finally(() => setLoading(false))
  }, [params?.categorySlug, params?.search, page])

  if (loading) return <div className={styles.loading}><Spinner /></div>
  if (!products.length) return <p className={styles.empty}>Продукты не найдены</p>

  return (
    <div className={styles.wrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
