import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { tokenStorage } from '@shared/api/adminApi'

const NAV_ITEMS = [
  { to: '/admin', label: 'Дашборд', icon: '📊', end: true },
  { to: '/admin/categories', label: 'Категории', icon: '📁' },
  { to: '/admin/products', label: 'Продукты', icon: '📦' },
  { to: '/admin/news', label: 'Новости', icon: '📰' },
  { to: '/admin/banners', label: 'Баннеры', icon: '🖼️' },
  { to: '/admin/orders', label: 'Заявки', icon: '📋' },
  { to: '/admin/documents', label: 'Документы', icon: '📎' },
]

export const AdminLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    tokenStorage.init()
    if (!tokenStorage.get()) navigate('/admin/login')
  }, [navigate])

  const handleLogout = () => {
    tokenStorage.clear()
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: '#1a1a2e', color: '#fff',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: 'var(--color-primary)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🏠</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Döcke</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Панель управления</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px', textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                fontSize: 14, transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: 17 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            🚪 Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: 32, minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
