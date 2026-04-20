import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PageHeader, useToast } from '@shared/ui/admin'
import { productApi } from '@entities/product'
import type { Product } from '@entities/product'
import { PATHS } from '@app/routes/paths'
import { AdminProductForm, type ProductFormInitial } from './AdminProductForm'
import styles from './AdminProductForm.module.scss'

const toInitial = (product: Product): ProductFormInitial => ({
  name: product.name ?? '',
  slug: product.slug ?? '',
  description: product.description ?? '',
  priceFrom: product.priceFrom != null ? String(product.priceFrom) : '',
  categoryId: product.categoryId ?? product.category?.id ?? '',
  isActive: product.isActive ?? true,
  isFeatured: product.isFeatured ?? false,
  images: Array.isArray(product.images) ? product.images : [],
  specifications: product.specifications
    ? Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value: String(value ?? ''),
      }))
    : [],
})

export const AdminProductEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [initial, setInitial] = useState<ProductFormInitial | null>(null)
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    setLoading(true)
    productApi
      .getAdminById(id)
      .then((product) => {
        if (cancelled) return
        if (!product) {
          setNotFound(true)
          toast.error('Товар не найден')
          return
        }
        setProductName(product.name)
        setInitial(toInitial(product))
      })
      .catch(() => {
        if (cancelled) return
        setNotFound(true)
        toast.error('Не удалось загрузить товар')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, toast])

  const title = productName ? `Редактирование: ${productName}` : 'Редактирование товара'

  return (
    <>
      <Helmet>
        <title>{productName ? `${productName} — Нексу Admin` : 'Редактирование — Нексу Admin'}</title>
      </Helmet>

      <PageHeader
        title={title}
        subtitle="Обновите данные и сохраните"
        action={
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate(PATHS.ADMIN_PRODUCTS)}
          >
            ← К списку
          </button>
        }
      />

      {loading ? (
        <p className={styles.stateText}>Загрузка...</p>
      ) : notFound || !initial || !id ? (
        <p className={styles.stateText}>Товар не найден.</p>
      ) : (
        <AdminProductForm mode="edit" initial={initial} productId={id} />
      )}
    </>
  )
}
