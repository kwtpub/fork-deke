import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Card, DataTable, PageHeader, useToast } from '@shared/ui/admin'
import type { Column } from '@shared/ui/admin'
import type { News } from '@entities/news'
import { PATHS } from '@app/routes/paths'
import styles from './AdminDashboard.module.scss'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface AdminUser {
  email?: string
  name?: string
}

type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled'

interface OrderRow {
  id: string
  name: string
  phone: string
  status: OrderStatus
  createdAt: string
}

interface Stats {
  products: number
  categories: number
  news: number
  ordersNew: number
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const readAdminUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem('admin_user')
    if (raw) return JSON.parse(raw) as AdminUser
  } catch {
    // ignore
  }
  const token = localStorage.getItem('admin_token')
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padding =
      normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
    const decoded = atob(normalized + padding)
    return JSON.parse(decoded) as AdminUser
  } catch {
    return null
  }
}

const formatDateTime = (iso?: string): string => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (iso?: string): string => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('ru-RU')
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнена',
  cancelled: 'Отменена',
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  new: styles.statusNew,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
}

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
interface SvgProps {
  children: ReactNode
}

const Svg = ({ children }: SvgProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

const BoxIcon = () => (
  <Svg>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Svg>
)

const FolderIcon = () => (
  <Svg>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
)

const NewsIcon = () => (
  <Svg>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6z" />
  </Svg>
)

const InboxIcon = () => (
  <Svg>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </Svg>
)

const PlusIcon = () => (
  <Svg>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
)

const ImageIcon = () => (
  <Svg>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </Svg>
)

const FileIcon = () => (
  <Svg>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </Svg>
)

// ------------------------------------------------------------------
// Stat card
// ------------------------------------------------------------------
interface StatCardProps {
  label: string
  value: number
  icon: ReactNode
  tone: 'green' | 'blue' | 'orange' | 'red'
  to: string
  loading: boolean
}

const TONE_CLASS: Record<StatCardProps['tone'], string> = {
  green: styles.statIconGreen,
  blue: styles.statIconBlue,
  orange: styles.statIconOrange,
  red: styles.statIconRed,
}

const StatCard = ({ label, value, icon, tone, to, loading }: StatCardProps) => (
  <Card className={styles.statCard}>
    <div className={styles.statHead}>
      <span className={`${styles.statIcon} ${TONE_CLASS[tone]}`}>{icon}</span>
    </div>
    <div className={styles.statBody}>
      {loading ? (
        <>
          <div className={styles.statSkeleton} />
          <div className={styles.statLabelSkeleton} />
        </>
      ) : (
        <>
          <div className={styles.statValue}>{value}</div>
          <div className={styles.statLabel}>{label}</div>
        </>
      )}
    </div>
    <div className={styles.statFooter}>
      <Link to={to} className={styles.statLink}>
        Управление →
      </Link>
    </div>
  </Card>
)

// ------------------------------------------------------------------
// Main
// ------------------------------------------------------------------
export const AdminDashboard = () => {
  const toast = useToast()
  const adminUser = useMemo(() => readAdminUser(), [])

  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    news: 0,
    ordersNew: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [recentNews, setRecentNews] = useState<News[]>([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.allSettled([
      apiInstance.get('/products?limit=100'),
      apiInstance.get('/categories'),
      apiInstance.get('/news?limit=100'),
      apiInstance.get('/orders'),
    ])
      .then(([prodRes, catRes, newsRes, ordersRes]) => {
        if (cancelled) return

        const readArray = <T,>(raw: unknown): T[] => {
          if (!raw || typeof raw !== 'object') return []
          const outer = (raw as { data?: unknown }).data
          if (Array.isArray(outer)) return outer as T[]
          if (outer && typeof outer === 'object') {
            const inner = (outer as { data?: unknown }).data
            if (Array.isArray(inner)) return inner as T[]
          }
          return []
        }

        const readMetaTotal = (raw: unknown): number | null => {
          if (!raw || typeof raw !== 'object') return null
          const outer = (raw as { data?: unknown }).data
          if (outer && typeof outer === 'object') {
            const meta = (outer as { meta?: { total?: number } }).meta
            if (meta && typeof meta.total === 'number') return meta.total
          }
          return null
        }

        let products = 0
        if (prodRes.status === 'fulfilled') {
          const total = readMetaTotal(prodRes.value.data)
          products = total ?? readArray(prodRes.value.data).length
        }

        let categories = 0
        if (catRes.status === 'fulfilled') {
          categories = readArray(catRes.value.data).length
        }

        let news = 0
        if (newsRes.status === 'fulfilled') {
          const total = readMetaTotal(newsRes.value.data)
          news = total ?? readArray(newsRes.value.data).length
        }

        let ordersNew = 0
        const ordersList = ordersRes.status === 'fulfilled' ? readArray<OrderRow>(ordersRes.value.data) : []
        ordersNew = ordersList.filter((o) => o.status === 'new').length

        setStats({ products, categories, news, ordersNew })

        const sortedOrders = [...ordersList].sort((a, b) => {
          const ta = new Date(a.createdAt).getTime()
          const tb = new Date(b.createdAt).getTime()
          return tb - ta
        })
        setRecentOrders(sortedOrders.slice(0, 5))

        const anyFailed =
          prodRes.status === 'rejected' ||
          catRes.status === 'rejected' ||
          newsRes.status === 'rejected' ||
          ordersRes.status === 'rejected'
        if (anyFailed) {
          toast.error('Не удалось загрузить некоторые данные дашборда')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setStatsLoading(false)
          setOrdersLoading(false)
        }
      })

    apiInstance
      .get<{ data: { data: News[] } | News[] }>('/news?limit=5')
      .then((r) => {
        if (cancelled) return
        const raw = r.data
        const list: News[] = Array.isArray(raw?.data)
          ? (raw.data as News[])
          : ((raw?.data as { data?: News[] })?.data ?? [])
        setRecentNews(list.slice(0, 5))
      })
      .catch(() => {
        if (!cancelled) {
          setRecentNews([])
          toast.error('Не удалось загрузить последние новости')
        }
      })
      .finally(() => {
        if (!cancelled) setNewsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const orderColumns: Column<OrderRow>[] = [
    {
      key: 'createdAt',
      label: 'Дата',
      width: '160px',
      render: (row) => formatDateTime(row.createdAt),
    },
    { key: 'name', label: 'Имя' },
    {
      key: 'phone',
      label: 'Телефон',
      render: (row) => (
        <a
          href={`tel:${row.phone}`}
          className={styles.rowLink}
          onClick={(e) => e.stopPropagation()}
        >
          {row.phone}
        </a>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      width: '140px',
      render: (row) => (
        <span className={`${styles.statusBadge} ${STATUS_CLASS[row.status] ?? ''}`}>
          {STATUS_LABEL[row.status] ?? row.status}
        </span>
      ),
    },
  ]

  const newsColumns: Column<News>[] = [
    {
      key: 'title',
      label: 'Заголовок',
      render: (row) => (
        <Link to={PATHS.ADMIN_NEWS_EDIT(row.id)} className={styles.rowLink}>
          {row.title}
        </Link>
      ),
    },
    {
      key: 'publishedAt',
      label: 'Дата',
      width: '140px',
      render: (row) => formatDate(row.publishedAt ?? row.createdAt),
    },
    {
      key: 'status',
      label: 'Статус',
      width: '140px',
      render: (row) => (
        <span
          className={`${styles.newsBadge} ${
            row.isPublished ? styles.newsBadgePublished : styles.newsBadgeDraft
          }`}
        >
          {row.isPublished ? 'Опубликовано' : 'Черновик'}
        </span>
      ),
    },
  ]

  const subtitle = adminUser?.email
    ? `Вы вошли как ${adminUser.email}`
    : 'Панель управления сайтом Нексу'

  return (
    <>
      <Helmet>
        <title>Дашборд — Нексу Admin</title>
      </Helmet>

      <PageHeader title="Добро пожаловать" subtitle={subtitle} />

      {/* Stats */}
      <div className={styles.stats}>
        <StatCard
          label="Товары"
          value={stats.products}
          icon={<BoxIcon />}
          tone="green"
          to={PATHS.ADMIN_PRODUCTS}
          loading={statsLoading}
        />
        <StatCard
          label="Категории"
          value={stats.categories}
          icon={<FolderIcon />}
          tone="blue"
          to={PATHS.ADMIN_CATEGORIES}
          loading={statsLoading}
        />
        <StatCard
          label="Новости"
          value={stats.news}
          icon={<NewsIcon />}
          tone="orange"
          to={PATHS.ADMIN_NEWS}
          loading={statsLoading}
        />
        <StatCard
          label="Новые заявки"
          value={stats.ordersNew}
          icon={<InboxIcon />}
          tone="red"
          to="/admin/orders"
          loading={statsLoading}
        />
      </div>

      {/* Quick actions */}
      <Card className={styles.actionsCard}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Быстрые действия</h2>
        </div>
        <div className={styles.actionsGrid}>
          <Link to={PATHS.ADMIN_PRODUCTS_NEW} className={styles.actionLink}>
            <span className={styles.actionIcon}>
              <PlusIcon />
            </span>
            <span className={styles.actionLabel}>Товар</span>
          </Link>
          <Link to={PATHS.ADMIN_NEWS_NEW} className={styles.actionLink}>
            <span className={styles.actionIcon}>
              <NewsIcon />
            </span>
            <span className={styles.actionLabel}>Новость</span>
          </Link>
          <Link to="/admin/banners" className={styles.actionLink}>
            <span className={styles.actionIcon}>
              <ImageIcon />
            </span>
            <span className={styles.actionLabel}>Баннер</span>
          </Link>
          <Link to="/admin/documents" className={styles.actionLink}>
            <span className={styles.actionIcon}>
              <FileIcon />
            </span>
            <span className={styles.actionLabel}>Документ</span>
          </Link>
        </div>
      </Card>

      {/* Recent rows */}
      <div className={styles.rowGrid}>
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Последние заявки</h2>
            <Link to="/admin/orders" className={styles.sectionLink}>
              Все →
            </Link>
          </div>
          <DataTable<OrderRow>
            columns={orderColumns}
            rows={recentOrders}
            loading={ordersLoading}
            emptyText="Заявок пока нет"
            getRowKey={(row) => row.id}
          />
        </Card>

        <Card className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Последние новости</h2>
            <Link to={PATHS.ADMIN_NEWS} className={styles.sectionLink}>
              Все →
            </Link>
          </div>
          <DataTable<News>
            columns={newsColumns}
            rows={recentNews}
            loading={newsLoading}
            emptyText="Новостей пока нет"
            getRowKey={(row) => row.id}
          />
        </Card>
      </div>
    </>
  )
}
