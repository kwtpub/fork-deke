import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { categoryApi } from '@entities/category'
import type { Category } from '@entities/category'
import { Spinner } from '@shared/ui/Spinner/Spinner'
import styles from './CatalogPage.module.scss'

const CategoryPlaceholder = () => (
  <svg viewBox="0 0 72 48" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="64" height="40" rx="3" />
    <path d="M4 34l16-16 14 12 8-8 26 20" />
    <circle cx="24" cy="18" r="4" />
  </svg>
)

export const CatalogPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryApi
      .getTree()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const roots = categories.filter((c) => !c.parentId)
  const seen = new Set<string>()
  const topLevel = roots.filter((c) => {
    if (seen.has(c.id)) return false
    seen.add(c.id)
    return true
  })

  return (
    <>
      <Helmet>
        <title>Каталог продукции — Нексу</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.topbar}>
          <div className="container">
            <nav aria-label="Breadcrumb" className={styles.crumbsInner}>
              <ol>
                <li>
                  <Link to="/">Главная</Link>
                  <span className={styles.sep}>/</span>
                </li>
                <li>
                  <span className={styles.current} aria-current="page">
                    Каталог
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          <section className={styles.titleSec}>
            <h1 className={styles.h1}>Каталог продукции</h1>
            <p className={styles.lead}>
              Фасадные материалы, декоративные и отделочные решения для вашего дома.
              Выберите раздел, чтобы увидеть доступные коллекции и товары.
            </p>
          </section>

          <section className={styles.groupsSec}>
            {loading ? (
              <div className={styles.loading}>
                <Spinner size="lg" />
              </div>
            ) : topLevel.length === 0 ? (
              <p className={styles.emptyGroup}>Пока нет категорий.</p>
            ) : (
              <div className={styles.group}>
                <div className={styles.grid}>
                  {topLevel.map((cat) => (
                    <CategoryTile key={cat.id} category={cat} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

interface CategoryTileProps {
  category: Category
}

const CategoryTile = ({ category }: CategoryTileProps) => (
  <Link to={`/catalog/${category.slug}`} className={styles.card}>
    <div
      className={`${styles.categoryCardImage} ${category.image ? '' : styles.noImage}`}
    >
      {category.image ? (
        <img src={category.image} alt={category.name} loading="lazy" />
      ) : (
        <span className={styles.cardPlaceholder}>
          <CategoryPlaceholder />
        </span>
      )}
    </div>
    <div className={styles.categoryCardBody}>
      <h3 className={styles.categoryName}>{category.name}</h3>
      {typeof category.productsCount === 'number' && (
        <p className={styles.categoryMeta}>{category.productsCount} товаров</p>
      )}
    </div>
  </Link>
)
