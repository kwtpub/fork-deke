import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@app/store'
import { PATHS } from '@app/routes/paths'
import { ENV } from '@shared/config/env'
import styles from './Header.module.scss'

const NAV_ITEMS = [
  { label: 'Продукция', href: PATHS.CATALOG },
  { label: 'О компании', href: PATHS.ABOUT },
  { label: 'Документация', href: PATHS.DOCS },
  { label: 'Калькулятор', href: PATHS.CALCULATOR },
  { label: 'Новости', href: PATHS.NEWS },
  { label: 'Контакты', href: PATHS.CONTACTS },
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
        <div className={styles.topBar}>
          <div className="container">
            <a href={`tel:${ENV.PHONE.replace(/\s/g, '')}`} className={styles.phone}>{ENV.PHONE}</a>
            <span className={styles.tagline}>Искусство инноваций</span>
          </div>
        </div>
        <div className={styles.main}>
          <div className={`container ${styles.mainInner}`}>
            <Link to={PATHS.HOME} className={styles.logo}>
              <span className={styles.logoText}>Döcke</span>
            </Link>
            <nav className={styles.nav}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} to={item.href} className={styles.navLink}>{item.label}</Link>
              ))}
            </nav>
            <div className={styles.rightGroup}>
              <Link to="/cart" className={styles.cartLink} aria-label="Корзина">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>
      </header>

      {/* Mobile menu overlay */}
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
          <p className={styles.mobileNote}>Звонок по России бесплатный</p>
        </div>
      </div>
      <main className={styles.content}><Outlet /></main>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <h4>Döcke</h4>
              <p>Производитель фасадных материалов, кровли и водостоков</p>
            </div>
            <div>
              <h4>Продукция</h4>
              <Link to="/catalog/fasadnye-materialy">Фасадные материалы</Link>
              <Link to="/catalog/krovlya">Кровля</Link>
              <Link to="/catalog/vodostoki">Водостоки</Link>
              <Link to="/catalog/lestnitsy">Лестницы</Link>
            </div>
            <div>
              <h4>Компания</h4>
              <Link to={PATHS.ABOUT}>О компании</Link>
              <Link to={PATHS.NEWS}>Новости</Link>
              <Link to={PATHS.CONTACTS}>Контакты</Link>
              <Link to={PATHS.DOCS}>Документация</Link>
            </div>
            <div>
              <h4>Контакты</h4>
              <a href={`tel:${ENV.PHONE.replace(/\s/g, '')}`}>{ENV.PHONE}</a>
              <p>Пн–Пт: 9:00–18:00</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Döcke. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
