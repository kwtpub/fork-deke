import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { newsApi, NewsItem } from '@entities/news'
import type { News } from '@entities/news'
import styles from './NewsSection.module.scss'

export const NewsSection = () => {
  const [news, setNews] = useState<News[]>([])
  useEffect(() => { newsApi.getList({ limit: 4 }).then((r) => setNews(r.data)) }, [])

  if (!news.length) return null
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title">Новости и акции</h2>
          <Link to="/news" className={styles.all}>Все новости →</Link>
        </div>
        <div className={styles.list}>
          {news.map((n) => <NewsItem key={n.id} news={n} />)}
        </div>
      </div>
    </section>
  )
}
