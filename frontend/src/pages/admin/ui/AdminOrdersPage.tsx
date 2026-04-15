import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'

interface Order {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  type: string
  status: string
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнена',
  cancelled: 'Отменена',
}
const STATUS_COLORS: Record<string, string> = {
  new: '#e3f2fd',
  in_progress: '#fff8e1',
  completed: '#e8f5e9',
  cancelled: '#fce4ec',
}
const STATUS_TEXT_COLORS: Record<string, string> = {
  new: '#1565c0',
  in_progress: '#e65100',
  completed: '#2e7d32',
  cancelled: '#c62828',
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const loadOrders = () => {
    setLoading(true)
    apiInstance.get('/orders')
      .then((r) => setOrders(r.data?.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [])

  const updateStatus = async (id: string, status: string) => {
    await apiInstance.patch(`/orders/${id}`, { status })
    loadOrders()
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const newCount = orders.filter((o) => o.status === 'new').length

  return (
    <>
      <Helmet><title>Заявки — Нексу Admin</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121' }}>
            Заявки
            {newCount > 0 && (
              <span style={{ marginLeft: 12, background: 'var(--color-primary)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 14 }}>
                {newCount} новых
              </span>
            )}
          </h1>
          <p style={{ color: '#757575', fontSize: 14 }}>{orders.length} всего</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'new', 'in_progress', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 16px', borderRadius: 20, border: '1px solid',
            borderColor: filter === s ? 'var(--color-primary)' : '#e0e0e0',
            background: filter === s ? 'var(--color-primary)' : '#fff',
            color: filter === s ? '#fff' : '#424242',
            cursor: 'pointer', fontSize: 13,
          }}>
            {s === 'all' ? 'Все' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: '#757575' }}>Загрузка...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((order) => (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#212121', marginBottom: 4 }}>{order.name}</p>
                  <p style={{ color: '#424242', fontSize: 14 }}>📞 <a href={`tel:${order.phone}`} style={{ color: 'inherit' }}>{order.phone}</a></p>
                  {order.email && <p style={{ color: '#424242', fontSize: 14 }}>✉️ {order.email}</p>}
                  {order.message && <p style={{ color: '#616161', fontSize: 13, marginTop: 8, fontStyle: 'italic' }}>"{order.message}"</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#9e9e9e', fontSize: 12, marginBottom: 8 }}>{formatDate(order.createdAt)}</p>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: STATUS_COLORS[order.status] ?? '#f5f5f5',
                    color: STATUS_TEXT_COLORS[order.status] ?? '#616161',
                  }}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#757575', alignSelf: 'center' }}>Изменить статус:</span>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  key !== order.status && (
                    <button key={key} onClick={() => updateStatus(order.id, key)} style={{
                      padding: '4px 12px', border: `1px solid ${STATUS_COLORS[key] ?? '#e0e0e0'}`,
                      borderRadius: 6, cursor: 'pointer', fontSize: 12,
                      background: STATUS_COLORS[key] ?? '#fff',
                      color: STATUS_TEXT_COLORS[key] ?? '#424242',
                    }}>
                      {label}
                    </button>
                  )
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#9e9e9e', padding: '40px 0' }}>Заявок нет</p>}
        </div>
      )}
    </>
  )
}
