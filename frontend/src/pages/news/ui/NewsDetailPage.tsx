import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { newsApi } from '@entities/news'
import type { News } from '@entities/news'
import styles from './NewsDetailPage.module.scss'

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    newsApi.getBySlug(slug)
      .then(setNews)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.state}>Загрузка...</div>
      </div>
    </div>
  )

  if (error || !news) return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.state}>
          <p>Новость не найдена</p>
          <Link to="/news" className={styles.stateLink}>← Все новости</Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{news.title} — Нексу</title>
        <meta name="description" content={news.excerpt} />
      </Helmet>

      <div className={styles.page}>
        <article className={styles.container}>
          <Link to="/news" className={styles.backLink}>← Все новости</Link>

          <div className={styles.meta}>
            <span className={styles.badge}>Новости</span>
            <span className={styles.date}>
              {formatDate(news.publishedAt ?? news.createdAt)}
            </span>
          </div>

          <h1 className={styles.title}>{news.title}</h1>

          {news.coverImage && (
            <img
              src={news.coverImage}
              alt={news.title}
              className={styles.hero}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}

          {news.excerpt && (
            <p className={styles.excerpt}>{news.excerpt}</p>
          )}

          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          <div className={styles.footer}>
            <Link to="/news" className={styles.footerLink}>← Все новости</Link>
          </div>
        </article>
      </div>
    </>
  )
}
