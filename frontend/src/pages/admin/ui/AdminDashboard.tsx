import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'

interface Stats {
  categories: number
  products: number
  news: number
  orders: number
}

const StatCard = ({ label, value, icon, to }: { label: string; value: number; icon: string; to: string }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fff', borderRadius: 16, padding: 28,
      border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 20,
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{
        width: 56, height: 56, background: '#fff3e0',
        borderRadius: 12, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 28, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <p style={{ color: '#757575', fontSize: 13, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#212121' }}>{value}</p>
      </div>
    </div>
  </Link>
)

const QUICK_LINKS = [
  { label: 'Добавить продукт', icon: '➕', to: '/admin/products/new' },
  { label: 'Добавить новость', icon: '✏️', to: '/admin/news/new' },
  { label: 'Добавить баннер', icon: '🖼️', to: '/admin/banners/new' },
  { label: 'Просмотр сайта', icon: '🌐', to: '/', target: '_blank' },
]

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ categories: 0, products: 0, news: 0, orders: 0 })

  useEffect(() => {
    Promise.allSettled([
      apiInstance.get('/categories'),
      apiInstance.get('/products'),
      apiInstance.get('/news'),
      apiInstance.get('/orders'),
    ]).then(([cats, prods, news, orders]) => {
      setStats({
        categories: cats.status === 'fulfilled' ? (cats.value.data?.data?.length ?? 0) : 0,
        products: prods.status === 'fulfilled' ? (prods.value.data?.data?.data?.length ?? prods.value.data?.data?.length ?? 0) : 0,
        news: news.status === 'fulfilled' ? (news.value.data?.data?.length ?? 0) : 0,
        orders: orders.status === 'fulfilled' ? (orders.value.data?.data?.length ?? 0) : 0,
      })
    })
  }, [])

  return (
    <>
      <Helmet><title>Дашборд — Нексу Admin</title></Helmet>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#212121', marginBottom: 6 }}>Дашборд</h1>
        <p style={{ color: '#757575' }}>Добро пожаловать в панель управления сайтом Нексу</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard label="Категории" value={stats.categories} icon="📁" to="/admin/categories" />
        <StatCard label="Продукты" value={stats.products} icon="📦" to="/admin/products" />
        <StatCard label="Новости" value={stats.news} icon="📰" to="/admin/news" />
        <StatCard label="Заявки" value={stats.orders} icon="📋" to="/admin/orders" />
      </div>

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#424242' }}>Быстрые действия</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {QUICK_LINKS.map(({ label, icon, to, target }) => (
            <a
              key={label}
              href={to}
              target={target}
              rel={target === '_blank' ? 'noopener noreferrer' : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', background: '#fff', border: '1px solid #e0e0e0',
                borderRadius: 10, textDecoration: 'none', color: '#424242',
                fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.color = '#424242'
              }}
            >
              <span>{icon}</span> {label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
