import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Pagination } from '@shared/ui/Pagination/Pagination'
import { newsApi } from '@entities/news'
import type { News } from '@entities/news'

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const NewsPage = () => {
  const [news, setNews] = useState<News[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 9

  useEffect(() => {
    setLoading(true)
    newsApi.getList({ page, limit })
      .then((r) => { setNews(r.data ?? []); setTotal(r.meta?.total ?? 0) })
      .catch(() => setNews([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <>
      <Helmet>
        <title>Новости — Döcke</title>
        <meta name="description" content="Последние новости компании Döcke — новинки продукции, мероприятия, советы по монтажу." />
      </Helmet>

      <section style={{ background: 'var(--color-primary)', color: '#fff', padding: '60px 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Новости' }]} />
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: '24px 0 12px' }}>Новости</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>Следите за обновлениями и полезными материалами</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#757575', padding: '60px 0' }}>Загрузка...</p>
          ) : news.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#757575', padding: '60px 0' }}>Новостей пока нет</p>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 28,
              }}>
                {news.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <article style={{
                      background: '#fff', border: '1px solid #e0e0e0',
                      borderRadius: 16, overflow: 'hidden',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      height: '100%',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'none'
                      }}
                    >
                      <div style={{
                        height: 200, background: '#f5f5f5',
                        overflow: 'hidden',
                      }}>
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 48, color: '#e0e0e0',
                          }}>📰</div>
                        )}
                      </div>
                      <div style={{ padding: 24 }}>
                        <p style={{ color: '#9e9e9e', fontSize: 13, marginBottom: 10 }}>
                          {formatDate(item.publishedAt ?? item.createdAt)}
                        </p>
                        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.4, color: '#212121' }}>
                          {item.title}
                        </h2>
                        <p style={{ color: '#616161', fontSize: 14, lineHeight: 1.6 }}>{item.excerpt}</p>
                        <p style={{ color: 'var(--color-primary)', fontSize: 14, fontWeight: 600, marginTop: 16 }}>
                          Читать далее →
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {total > limit && (
                <div style={{ marginTop: 40 }}>
                  <Pagination
                    page={page}
                    totalPages={Math.ceil(total / limit)}
                    onChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
