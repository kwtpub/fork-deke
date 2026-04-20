import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { PATHS } from '@app/routes/paths'
import styles from './NotFoundPage.module.scss'

export const NotFoundPage = () => (
  <>
    <Helmet>
      <title>Страница не найдена — Нексу</title>
    </Helmet>
    <section className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.heading}>Страница не найдена</h2>
      <p className={styles.description}>
        Запрашиваемая страница не существует или была перемещена
      </p>
      <Link to={PATHS.HOME} className={styles.button}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        На главную
      </Link>
    </section>
  </>
)
