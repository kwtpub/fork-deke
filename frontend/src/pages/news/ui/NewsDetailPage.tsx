import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { newsApi } from '@entities/news'
import type { News } from '@entities/news'

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
    <div className="container" style={{ padding: '80px 20px', textAlign: 'center', color: '#757575' }}>
      Загрузка...
    </div>
  )

  if (error || !news) return (
    <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <p style={{ color: '#757575', marginBottom: 24 }}>Новость не найдена</p>
      <Link to="/news" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>← Все новости</Link>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{news.title} — Нексу</title>
        <meta name="description" content={news.excerpt} />
      </Helmet>

      <div style={{ background: 'var(--color-primary)', padding: '40px 0' }}>
        <div className="container">
          <Breadcrumb items={[
            { label: 'Главная', href: '/' },
            { label: 'Новости', href: '/news' },
            { label: news.title },
          ]} />
        </div>
      </div>

      <article className="container" style={{ maxWidth: 800, padding: '48px 20px' }}>
        {news.coverImage && (
          <img
            src={news.coverImage}
            alt={news.title}
            style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 16, marginBottom: 32 }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}

        <p style={{ color: '#9e9e9e', fontSize: 14, marginBottom: 12 }}>
          {formatDate(news.publishedAt ?? news.createdAt)}
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#212121', marginBottom: 16, lineHeight: 1.3 }}>
          {news.title}
        </h1>
        <p style={{ fontSize: 17, color: '#616161', marginBottom: 32, lineHeight: 1.7 }}>
          {news.excerpt}
        </p>

        <div
          style={{ color: '#424242', lineHeight: 1.8, fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #e0e0e0' }}>
          <Link
            to="/news"
            style={{
              color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            ← Все новости
          </Link>
        </div>
      </article>
    </>
  )
}
