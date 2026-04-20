import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { PageHeader, DataTable, useToast, useConfirm } from '@shared/ui/admin'
import type { Column } from '@shared/ui/admin'
import styles from './AdminOrdersPage.module.scss'

type OrderStatus = 'new' | 'in_progress' | 'done' | 'cancelled'
type OrderType = 'callback' | 'consultation' | 'order' | string

type OrderRow = {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  type: OrderType
  status: OrderStatus
  createdAt: string
}

type FilterValue = 'all' | OrderStatus

const STATUS_OPTION_LABELS: Record<OrderStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
  cancelled: 'Отменена',
}

const TYPE_LABELS: Record<string, string> = {
  callback: 'Звонок',
  consultation: 'Консультация',
  order: 'Заказ',
}

const STATUS_SELECT_CLASS: Record<OrderStatus, string> = {
  new: styles.statusNew,
  in_progress: styles.statusInProgress,
  done: styles.statusCompleted,
  cancelled: styles.statusCancelled,
}

const TYPE_BADGE_CLASS: Record<string, string> = {
  callback: styles.typeCallback,
  consultation: styles.typeConsultation,
  order: styles.typeOrder,
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Выполнены' },
  { value: 'cancelled', label: 'Отменены' },
]

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const AdminOrdersPage = () => {
  const toast = useToast()
  const confirm = useConfirm()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadOrders = () => {
    setLoading(true)
    apiInstance
      .get<{ data: OrderRow[] }>('/orders')
      .then((r) => setOrders(r.data?.data ?? []))
      .catch(() => {
        setOrders([])
        toast.error('Не удалось загрузить заявки')
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [])

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await apiInstance.patch(`/orders/${id}`, { status })
      toast.success('Статус обновлён')
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch {
      toast.error('Не удалось обновить статус')
    }
  }

  const removeOrder = async (id: string) => {
    const ok = await confirm({
      title: 'Удалить заявку?',
      message: 'Действие необратимо.',
      confirmText: 'Удалить',
      destructive: true,
    })
    if (!ok) return
    try {
      await apiInstance.delete(`/orders/${id}`)
      setOrders((prev) => prev.filter((o) => o.id !== id))
      if (expandedId === id) setExpandedId(null)
      toast.success('Заявка удалена')
    } catch {
      toast.error('Не удалось удалить заявку')
    }
  }

  const filtered = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  )

  const counts = useMemo(() => {
    const base: Record<FilterValue, number> = {
      all: orders.length,
      new: 0,
      in_progress: 0,
      done: 0,
      cancelled: 0,
    }
    for (const o of orders) {
      if (o.status in base) base[o.status as OrderStatus] += 1
    }
    return base
  }, [orders])

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  const columns: Column<OrderRow>[] = [
    {
      key: 'createdAt',
      label: 'Дата',
      width: '170px',
      render: (row) => <span className={styles.dateCell}>{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'type',
      label: 'Тип',
      width: '140px',
      render: (row) => (
        <span
          className={`${styles.typeBadge} ${TYPE_BADGE_CLASS[row.type] ?? styles.typeOrder}`}
        >
          {TYPE_LABELS[row.type] ?? row.type}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Имя',
      render: (row) => <span className={styles.nameCell}>{row.name}</span>,
    },
    {
      key: 'phone',
      label: 'Телефон',
      render: (row) => (
        <a
          className={styles.phoneLink}
          href={`tel:${row.phone}`}
          onClick={(e) => e.stopPropagation()}
        >
          {row.phone}
        </a>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) =>
        row.email ? (
          <a
            className={styles.emailLink}
            href={`mailto:${row.email}`}
            onClick={(e) => e.stopPropagation()}
          >
            {row.email}
          </a>
        ) : (
          <span className={styles.emailLink}>—</span>
        ),
    },
    {
      key: 'status',
      label: 'Статус',
      width: '160px',
      render: (row) => (
        <span className={styles.rowStopProp} onClick={(e) => e.stopPropagation()}>
          <select
            className={`${styles.statusSelect} ${STATUS_SELECT_CLASS[row.status] ?? ''}`}
            value={row.status}
            onChange={(e) => {
              void updateStatus(row.id, e.target.value as OrderStatus)
            }}
          >
            {(Object.keys(STATUS_OPTION_LABELS) as OrderStatus[]).map((value) => (
              <option key={value} value={value}>
                {STATUS_OPTION_LABELS[value]}
              </option>
            ))}
          </select>
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      width: '130px',
      align: 'center',
      render: (row) => {
        const isOpen = expandedId === row.id
        return (
          <div className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`${styles.expandButton} ${isOpen ? styles.expandButtonOpen : ''}`}
              aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
              onClick={() => toggleExpand(row.id)}
            >
              <ChevronDown />
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              aria-label="Удалить заявку"
              onClick={() => {
                void removeOrder(row.id)
              }}
            >
              <TrashIcon />
            </button>
          </div>
        )
      },
    },
  ]

  // DataTable не знает про раскрывающиеся строки — рендерим одной строкой,
  // но раскрытое сообщение выводим под основной таблицей отдельной панелью
  // через собственный рендер. Чтобы не ломать существующие паттерны,
  // используем встроенное действие: при клике по строке раскрываем сообщение.
  const rows = filtered

  return (
    <>
      <Helmet>
        <title>Заявки — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Заявки"
        subtitle={`Обращения с сайта · ${orders.length} ${pluralize(orders.length, ['заявка', 'заявки', 'заявок'])}`}
      />

      <div className={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              className={`${styles.pill} ${active ? styles.pillActive : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              <span className={styles.pillCount}>{counts[f.value]}</span>
            </button>
          )
        })}
      </div>

      <DataTable<OrderRow>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText={filter === 'all' ? 'Заявок нет' : 'В этой категории пусто'}
        getRowKey={(row) => row.id}
        onRowClick={(row) => toggleExpand(row.id)}
      />

      {expandedId && (() => {
        const row = rows.find((r) => r.id === expandedId)
        if (!row) return null
        return (
          <div className={styles.messageRow} style={{ marginTop: 12, borderRadius: 15, overflow: 'hidden' }}>
            <div className={styles.messageInner}>
              <span className={styles.messageLabel}>Сообщение от {row.name}</span>
              {row.message ? (
                <p className={styles.messageText}>{row.message}</p>
              ) : (
                <p className={styles.messageEmpty}>Без сообщения</p>
              )}
            </div>
          </div>
        )
      })()}
    </>
  )
}

const pluralize = (n: number, forms: [string, string, string]): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}
