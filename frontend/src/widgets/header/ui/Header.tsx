import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
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
            <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
              <span /><span /><span />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <div className="container">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} to={item.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
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
