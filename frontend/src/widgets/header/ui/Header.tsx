import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@app/store'
import { PATHS } from '@app/routes/paths'
import { ENV } from '@shared/config/env'
import { Footer } from '@widgets/footer'
import styles from './Header.module.scss'

const NAV_ITEMS = [
  { label: 'Каталог', href: PATHS.CATALOG },
  { label: 'Калькулятор', href: PATHS.CALCULATOR },
  { label: 'Новости', href: PATHS.NEWS },
  { label: 'О нас', href: PATHS.ABOUT },
  { label: 'Контакты', href: PATHS.CONTACTS },
  { label: 'Документы', href: PATHS.DOCS },
]

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useSelector((s: RootState) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0))
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to={PATHS.HOME} className={styles.logo} aria-label="НЕКСУ">
            <span className={styles.logoMark}>Н</span>
            <span className={styles.logoText}>НЕКСУ</span>
          </Link>
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} to={item.href} className={styles.navLink}>{item.label}</Link>
            ))}
          </nav>
          <div className={styles.rightGroup}>
            <a href={`tel:${ENV.PHONE.replace(/\s/g, '')}`} className={styles.phone}>{ENV.PHONE}</a>
            <Link to="/cart" className={styles.cartLink} aria-label="Корзина">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
            <button
              className={`${styles.burger} ${menuOpen ? styles.burgerActive : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              to={item.href}
              className={styles.mobileLink}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className={styles.mobileLink}
            style={{ transitionDelay: menuOpen ? `${NAV_ITEMS.length * 50}ms` : '0ms' }}
          >
            Корзина{cartCount > 0 && <span className={styles.mobileCartBadge}>{cartCount}</span>}
          </Link>
        </nav>
        <div className={styles.mobileBottom}>
          <a href={`tel:${ENV.PHONE.replace(/\s/g, '')}`} className={styles.mobilePhone}>{ENV.PHONE}</a>
        </div>
      </div>

      <main className={styles.content}><Outlet /></main>
      <Footer />
    </>
  )
}
