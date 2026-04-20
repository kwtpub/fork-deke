import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import { categoryApi } from '@entities/category'
import type { Category } from '@entities/category'
import { productApi } from '@entities/product'
import type { Product } from '@entities/product'
import { addToCart } from '@features/cart/model/cartSlice'
import { formatPrice } from '@shared/lib/formatPrice'
import { Spinner } from '@shared/ui/Spinner/Spinner'
import styles from './CatalogPage.module.scss'

interface ProductGroup {
  key: string
  title: string | null
  products: Product[]
}

const groupProducts = (products: Product[]): ProductGroup[] => {
  const groups = new Map<string, ProductGroup>()
  for (const p of products) {
    const seriesName = p.series?.[0]?.name ?? null
    const key = seriesName ?? '__ungrouped__'
    const title = seriesName ?? null
    const existing = groups.get(key)
    if (existing) {
      existing.products.push(p)
    } else {
      groups.set(key, { key, title, products: [p] })
    }
  }
  return Array.from(groups.values())
}

const PlaceholderIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="10" width="36" height="28" rx="2" />
    <circle cx="17" cy="21" r="3" />
    <path d="m6 32 12-12 12 10 6-6 8 8" />
  </svg>
)

export const CatalogCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useDispatch()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      categoryApi.getBySlug(slug).catch(() => null),
      productApi
        .getList({ categorySlug: slug, limit: 100 })
        .then((res) => res.data)
        .catch(() => [] as Product[]),
    ])
      .then(([cat, prods]) => {
        setCategory(cat)
        setProducts(prods)
      })
      .finally(() => setLoading(false))
  }, [slug])

  const groups = useMemo(() => groupProducts(products), [products])

  const handleOrder = (product: Product) => {
    const catSlug = product.categorySlug || product.category?.slug || slug || ''
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        categorySlug: catSlug,
        image: product.images[0] ?? '/images/placeholder.jpg',
        price: product.priceFrom ?? 0,
      }),
    )
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p className={styles.empty}>Категория не найдена</p>
        </div>
      </div>
    )
  }

  const title = category.name
  const description = category.description

  return (
    <>
      <Helmet>
        <title>{title} — Нексу</title>
        {description && <meta name="description" content={description} />}
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
                  <Link to="/catalog">Каталог</Link>
                  <span className={styles.sep}>/</span>
                </li>
                <li>
                  <span className={styles.current} aria-current="page">
                    {title}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          <section className={styles.titleSec}>
            <h1 className={styles.h1}>{title}</h1>
            {description && <p className={styles.lead}>{description}</p>}
          </section>

          <section className={styles.groupsSec}>
            {groups.length === 0 ? (
              <p className={styles.emptyGroup}>В этой категории пока нет товаров.</p>
            ) : (
              groups.map((group) => (
                <div key={group.key} className={styles.group}>
                  {group.title && <h2 className={styles.groupTitle}>{group.title}</h2>}
                  <div className={styles.grid}>
                    {group.products.map((product) => {
                      const catSlug =
                        product.categorySlug || product.category?.slug || slug || ''
                      const img = product.images[0]
                      return (
                        <article key={product.id} className={styles.card}>
                          <Link
                            to={`/catalog/${catSlug}/${product.slug}`}
                            className={styles.cardImage}
                            aria-label={product.name}
                          >
                            {img ? (
                              <img src={img} alt={product.name} loading="lazy" />
                            ) : (
                              <span className={styles.cardPlaceholder}>
                                <PlaceholderIcon />
                              </span>
                            )}
                          </Link>
                          <div className={styles.cardBody}>
                            <Link
                              to={`/catalog/${catSlug}/${product.slug}`}
                              style={{ color: 'inherit' }}
                            >
                              <h3 className={styles.cardName}>{product.name}</h3>
                            </Link>
                            {product.priceFrom ? (
                              <p className={styles.cardPrice}>
                                {formatPrice(product.priceFrom)}
                                <span className={styles.priceUnit}>/ шт</span>
                              </p>
                            ) : (
                              <p className={styles.cardPriceEmpty}>Цена по запросу</p>
                            )}
                            <button
                              type="button"
                              className={styles.cardBtn}
                              onClick={() => handleOrder(product)}
                            >
                              Заказать
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {description && (
          <section className={styles.aboutSec}>
            <div className="container">
              <h2 className={styles.aboutTitle}>О коллекции {title}</h2>
              <p className={styles.aboutText}>{description}</p>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
