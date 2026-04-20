import { Link } from 'react-router-dom'
import { PATHS } from '@app/routes/paths'
import { ENV } from '@shared/config/env'
import styles from './Footer.module.scss'

const NAV_LINKS = [
  { label: 'Каталог', href: PATHS.CATALOG },
  { label: 'Калькулятор', href: PATHS.CALCULATOR },
  { label: 'Новости', href: PATHS.NEWS },
  { label: 'О компании', href: PATHS.ABOUT },
]

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div className={styles.col1}>
        <Link to={PATHS.HOME} className={styles.logo} aria-label="НЕКСУ">
          <span className={styles.logoMark}>Н</span>
          <span className={styles.logoText}>НЕКСУ</span>
        </Link>
        <p className={styles.about}>
          Надёжный поставщик строительных материалов с 2005 года. Качество, проверенное временем.
        </p>
      </div>

      <div className={styles.col}>
        <h4 className={styles.colTitle}>НАВИГАЦИЯ</h4>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} to={link.href} className={styles.colLink}>{link.label}</Link>
        ))}
      </div>

      <div className={styles.col}>
        <h4 className={styles.colTitle}>КОНТАКТЫ</h4>
        <a href={`tel:${ENV.PHONE.replace(/\s/g, '')}`} className={styles.colLink}>{ENV.PHONE}</a>
        <a href="mailto:info@nexu.ru" className={styles.colLink}>info@nexu.ru</a>
        <span className={styles.colText}>г. Москва, ул. Строителей, 42</span>
      </div>

      <div className={styles.col}>
        <h4 className={styles.colTitle}>РЕЖИМ РАБОТЫ</h4>
        <span className={styles.colText}>Пн–Пт: 8:00–20:00</span>
        <span className={styles.colText}>Сб: 9:00–18:00</span>
        <span className={styles.colText}>Вс: выходной</span>
      </div>
    </div>

    <div className={styles.divider} />

    <p className={styles.copyright}>© {new Date().getFullYear()} НЕКСУ. Все права защищены.</p>
  </footer>
)
