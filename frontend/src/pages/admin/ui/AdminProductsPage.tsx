import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PageHeader, Button, Card, DataTable, useToast, useConfirm } from '@shared/ui/admin'
import type { Column } from '@shared/ui/admin'
import { productApi } from '@entities/product'
import type { Product } from '@entities/product'
import { PATHS } from '@app/routes/paths'
import styles from './AdminProductsPage.module.scss'

type ProductRow = {
  id: string
  name: string
  slug: string
  image: string | null
  categoryName: string
  priceFrom: number | null
  isActive: boolean
}

const formatPrice = (price: number | null) =>
  price ? `от ${price.toLocaleString('ru-RU')} ₽` : '—'

const toRow = (p: Product): ProductRow => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  image: p.images?.[0] ?? null,
  categoryName: p.category?.name ?? '—',
  priceFrom: p.priceFrom ?? null,
  isActive: p.isActive,
})

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export const AdminProductsPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const loadProducts = () => {
    setLoading(true)
    productApi
      .getAdminAll(100)
      .then((list) => setProducts(list))
      .catch(() => {
        setProducts([])
        toast.error('Не удалось загрузить список товаров')
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [])

  const toggleActive = async (row: ProductRow) => {
    try {
      await productApi.updateAdmin(row.id, { isActive: !row.isActive })
      toast.success('Статус обновлён')
      loadProducts()
    } catch {
      toast.error('Не удалось обновить статус')
    }
  }

  const deleteProduct = async (row: ProductRow) => {
    const ok = await confirm({
      destructive: true,
      title: 'Удалить товар?',
      message: `«${row.name}». Действие необратимо.`,
      confirmText: 'Удалить',
    })
    if (!ok) return
    try {
      await productApi.deleteAdmin(row.id)
      toast.success('Товар удалён')
      loadProducts()
    } catch {
      toast.error('Не удалось удалить товар')
    }
  }

  const rows = useMemo<ProductRow[]>(() => {
    const mapped = products.map(toRow)
    const q = query.trim().toLowerCase()
    if (!q) return mapped
    return mapped.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.categoryName.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q),
    )
  }, [products, query])

  const columns: Column<ProductRow>[] = [
    {
      key: 'image',
      label: 'Фото',
      width: '72px',
      render: (row) =>
        row.image ? (
          <img src={row.image} alt="" className={styles.thumb} />
        ) : (
          <span className={styles.thumbPlaceholder}>—</span>
        ),
    },
    {
      key: 'name',
      label: 'Название',
      render: (row) => (
        <div className={styles.nameCell}>
          {row.name}
          <span className={styles.slugLine}>{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Категория',
      render: (row) => <span className={styles.categoryCell}>{row.categoryName}</span>,
    },
    {
      key: 'price',
      label: 'Цена от',
      render: (row) => <span className={styles.priceCell}>{formatPrice(row.priceFrom)}</span>,
    },
    {
      key: 'status',
      label: 'Статус',
      render: (row) => (
        <span
          className={`${styles.badge} ${row.isActive ? styles.badgeActive : styles.badgeInactive}`}
        >
          {row.isActive ? 'Активен' : 'Скрыт'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      width: '140px',
      render: (row) => (
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.iconBtn}
            title={row.isActive ? 'Скрыть' : 'Показать'}
            onClick={() => {
              void toggleActive(row)
            }}
          >
            {row.isActive ? <EyeIcon /> : <EyeOffIcon />}
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="Редактировать"
            onClick={() => navigate(PATHS.ADMIN_PRODUCT_EDIT(row.id))}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            title="Удалить"
            onClick={() => {
              void deleteProduct(row)
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Helmet>
        <title>Товары — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Товары"
        subtitle={`Управление каталогом · ${products.length} позиций`}
        action={
          <Button variant="primary" onClick={() => navigate(PATHS.ADMIN_PRODUCTS_NEW)}>
            + Добавить товар
          </Button>
        }
      />

      <Card className={styles.searchCard} padded={false}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Поиск по названию, категории или slug..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      <DataTable<ProductRow>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText={query ? 'По запросу ничего не найдено' : 'Товары не найдены'}
        getRowKey={(row) => row.id}
        onRowClick={(row) => navigate(PATHS.ADMIN_PRODUCT_EDIT(row.id))}
      />
    </>
  )
}
