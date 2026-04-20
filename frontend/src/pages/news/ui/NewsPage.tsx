import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { newsApi } from '@entities/news'
import type { News } from '@entities/news'
import styles from './NewsPage.module.scss'

const CATEGORY_ROTATION = ['Кровля', 'Фундамент', 'Фасады']

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const pickCategory = (item: News, index: number) => {
  const anyItem = item as News & { category?: string }
  if (anyItem.category) return anyItem.category
  return CATEGORY_ROTATION[index % CATEGORY_ROTATION.length]
}

export const NewsPage = () => {
  const [news, setNews] = useState<News[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 9

  useEffect(() => {
    setLoading(true)
    newsApi
      .getList({ page, limit })
      .then((r) => {
        const incoming = r.data ?? []
        setNews((prev) => (page === 1 ? incoming : [...prev, ...incoming]))
        setTotal(r.meta?.total ?? 0)
      })
      .catch(() => {
        if (page === 1) setNews([])
      })
      .finally(() => setLoading(false))
  }, [page])

  const featured = news[0]
  const rest = useMemo(() => news.slice(1), [news])
  const canLoadMore = news.length < total

  return (
    <>
      <Helmet>
        <title>Новости и статьи — Нексу</title>
        <meta
          name="description"
          content="Последние новости и статьи компании Нексу — новинки продукции, мероприятия, советы по монтажу."
        />
      </Helmet>

      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Новости и статьи</h1>

          {loading && news.length === 0 ? (
            <p className={styles.state}>Загрузка...</p>
          ) : news.length === 0 ? (
            <p className={styles.state}>Новостей пока нет</p>
          ) : (
            <>
              {featured && (
                <Link to={`/news/${featured.slug}`} className={styles.featured}>
                  <div className={styles.featuredImage}>
                    {featured.coverImage ? (
                      <img src={featured.coverImage} alt={featured.title} />
                    ) : (
                      <div className={styles.featuredImagePlaceholder} />
                    )}
                  </div>
                  <div className={styles.featuredBody}>
                    <div className={styles.featuredTop}>
                      <span className={styles.badge}>Главная</span>
                      <h2 className={styles.featuredTitle}>{featured.title}</h2>
                      <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                    </div>
                    <p className={styles.featuredDate}>
                      {formatDate(featured.publishedAt ?? featured.createdAt)}
                    </p>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <>
                  <h2 className={styles.subtitle}>Последние публикации</h2>
                  <div className={styles.grid}>
                    {rest.map((item, index) => (
                      <Link
                        key={item.id}
                        to={`/news/${item.slug}`}
                        className={styles.card}
                      >
                        <div className={styles.cardImage}>
                          {item.coverImage ? (
                            <img src={item.coverImage} alt={item.title} />
                          ) : (
                            <div className={styles.cardImagePlaceholder} />
                          )}
                        </div>
                        <div className={styles.cardBody}>
                          <span className={styles.badge}>
                            {pickCategory(item, index)}
                          </span>
                          <h3 className={styles.cardTitle}>{item.title}</h3>
                          <p className={styles.cardExcerpt}>{item.excerpt}</p>
                          <p className={styles.cardDate}>
                            {formatDate(item.publishedAt ?? item.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {canLoadMore && (
                <div className={styles.loadMoreWrap}>
                  <button
                    type="button"
                    className={styles.loadMore}
                    disabled={loading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {loading ? 'Загрузка...' : 'Показать ещё'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
