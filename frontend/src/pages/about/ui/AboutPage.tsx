import type { ReactElement } from 'react'
import { Helmet } from 'react-helmet-async'
import styles from './AboutPage.module.scss'

type Stat = { number: string; label: string }
type Value = { icon: ReactElement; title: string; description: string }

const STATS: Stat[] = [
  { number: '18+', label: 'лет на рынке' },
  { number: '50 000+', label: 'клиентов' },
  { number: '10 000+', label: 'товаров' },
  { number: '98%', label: 'довольных клиентов' },
]

/* Inline lucide-style SVGs, stroke=currentColor so the .valueIcon color applies. */
const IconShieldCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
)

const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    <circle cx="12" cy="8" r="6" />
  </svg>
)

const VALUES: Value[] = [
  {
    icon: <IconShieldCheck />,
    title: 'Качество',
    description: 'Только сертифицированные материалы от проверенных производителей',
  },
  {
    icon: <IconTruck />,
    title: 'Надёжность',
    description: 'Собственная логистика и доставка по всей России в кратчайшие сроки',
  },
  {
    icon: <IconAward />,
    title: 'Экспертиза',
    description: 'Профессиональные консультации и помощь в подборе материалов',
  },
]

export const AboutPage = () => (
  <div className={styles.page}>
    <Helmet>
      <title>О компании — Нексу</title>
      <meta
        name="description"
        content="Нексу — надёжный поставщик строительных материалов с 2005 года. Качество, надёжность и экспертиза в каждом проекте."
      />
    </Helmet>

    {/* Hero */}
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <div>
        <h1 id="about-hero-title" className={styles.heroTitle}>О компании</h1>
        <p className={styles.heroSub}>
          Надёжный поставщик строительных материалов с 2005 года
        </p>
      </div>
    </section>

    {/* Stats */}
    <section className={styles.stats} aria-label="Ключевые показатели">
      {STATS.map(({ number, label }) => (
        <div key={label} className={styles.statCell}>
          <span className={styles.statNumber}>{number}</span>
          <span className={styles.statLabel}>{label}</span>
        </div>
      ))}
    </section>

    {/* Mission */}
    <section className={styles.mission} aria-labelledby="about-mission-title">
      <h2 id="about-mission-title" className={styles.missionTitle}>Наша миссия</h2>
      <p className={styles.missionText}>
        Мы стремимся обеспечить каждого клиента качественными строительными материалами по доступным ценам.
        Наша команда экспертов помогает подобрать оптимальные решения для любого проекта — от частного
        строительства до крупных промышленных объектов.
      </p>

      <div className={styles.valuesRow}>
        {VALUES.map(({ icon, title, description }) => (
          <article key={title} className={styles.valueCard}>
            <span className={styles.valueIcon}>{icon}</span>
            <h3 className={styles.valueTitle}>{title}</h3>
            <p className={styles.valueDesc}>{description}</p>
          </article>
        ))}
      </div>
    </section>

    {/* Warehouse / photo section */}
    <section className={styles.warehouse} aria-hidden />
  </div>
)
