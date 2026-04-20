import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { tokenStorage } from '@shared/api/adminApi'
import styles from './AdminLayout.module.scss'

// ---------- Icons (lucide-style, stroke currentColor) ----------
interface IconProps {
  className?: string
}

const Icon = ({ children, className }: { children: ReactNode; className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
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

const DashboardIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </Icon>
)

const ProductsIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
)

const CategoriesIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Icon>
)

const NewsIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6z" />
  </Icon>
)

const BannersIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </Icon>
)

const OrdersIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <path d="M9 11H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3" />
    <polyline points="9 14 12 17 22 7" />
    <path d="M12 22V12" />
  </Icon>
)

const DocumentsIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </Icon>
)

const LogoutIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
)

const MenuIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Icon>
)

const CloseIcon = (p: IconProps) => (
  <Icon className={p.className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
)

// ---------- Nav items ----------
interface NavItem {
  to: string
  label: string
  icon: (p: IconProps) => ReactNode
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Дашборд', icon: (p) => <DashboardIcon {...p} />, end: true },
  { to: '/admin/products', label: 'Товары', icon: (p) => <ProductsIcon {...p} /> },
  { to: '/admin/categories', label: 'Категории', icon: (p) => <CategoriesIcon {...p} /> },
  { to: '/admin/news', label: 'Новости', icon: (p) => <NewsIcon {...p} /> },
  { to: '/admin/banners', label: 'Баннеры', icon: (p) => <BannersIcon {...p} /> },
  { to: '/admin/orders', label: 'Заявки', icon: (p) => <OrdersIcon {...p} /> },
  { to: '/admin/documents', label: 'Документы', icon: (p) => <DocumentsIcon {...p} /> },
]

// ---------- Admin user helpers ----------
interface AdminUser {
  email?: string
  name?: string
}

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
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
    const decoded = atob(normalized + padding)
    const parsed = JSON.parse(decoded) as AdminUser
    return parsed
  } catch {
    return null
  }
}

// ---------- Component ----------
export const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    tokenStorage.init()
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const adminUser = useMemo(() => readAdminUser(), [])

  const handleLogout = () => {
    tokenStorage.clear()
    try {
      localStorage.removeItem('admin_user')
    } catch {
      // ignore
    }
    navigate('/admin/login')
  }

  const renderNav = (extraClass?: string) => (
    <nav className={`${styles.nav} ${extraClass ?? ''}`}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
          }
        >
          <span className={styles.navIcon}>{item.icon({ className: styles.iconSvg })}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className={styles.root}>
      {/* Desktop sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>Н</span>
          <div className={styles.brandText}>
            <span className={styles.brandName}>НЕКСУ</span>
            <span className={styles.brandSubtitle}>Панель управления</span>
          </div>
        </div>

        {renderNav()}

        <div className={styles.sidebarFooter}>
          {adminUser?.email && (
            <div className={styles.userBlock}>
              <span className={styles.userLabel}>Администратор</span>
              <span className={styles.userEmail} title={adminUser.email}>{adminUser.email}</span>
            </div>
          )}
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon className={styles.iconSvg} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.burger}
          aria-label="Открыть меню"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <CloseIcon className={styles.iconSvg} />
          ) : (
            <MenuIcon className={styles.iconSvg} />
          )}
        </button>
        <div className={styles.topBrand}>
          <span className={styles.logoMark}>Н</span>
          <span className={styles.brandName}>НЕКСУ</span>
        </div>
        <button
          type="button"
          className={styles.topLogout}
          onClick={handleLogout}
          aria-label="Выйти"
        >
          <LogoutIcon className={styles.iconSvg} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawerOverlay} ${mobileOpen ? styles.drawerOverlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>Н</span>
          <div className={styles.brandText}>
            <span className={styles.brandName}>НЕКСУ</span>
            <span className={styles.brandSubtitle}>Панель управления</span>
          </div>
        </div>
        {renderNav()}
        <div className={styles.sidebarFooter}>
          {adminUser?.email && (
            <div className={styles.userBlock}>
              <span className={styles.userLabel}>Администратор</span>
              <span className={styles.userEmail} title={adminUser.email}>{adminUser.email}</span>
            </div>
          )}
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon className={styles.iconSvg} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
