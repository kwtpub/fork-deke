import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { productApi } from '@entities/product'
import type { Product } from '@entities/product'
import { useDebounce } from '@shared/hooks/useDebounce'
import { formatPrice } from '@shared/lib/formatPrice'
import styles from './SearchPage.module.scss'

interface Chip {
  id: string
  label: string
  categorySlug?: string
}

const CHIPS: Chip[] = [
  { id: 'all', label: 'Все' },
  { id: 'brick', label: 'Кирпич', categorySlug: 'brick' },
  { id: 'concrete', label: 'Бетон', categorySlug: 'concrete' },
  { id: 'wood', label: 'Дерево', categorySlug: 'wood' },
  { id: 'roof', label: 'Кровля', categorySlug: 'roof' },
]

const DEFAULT_PRICE_UNIT = '/шт'

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [activeChip, setActiveChip] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    const current = searchParams.get('q') ?? ''
    if (debouncedQuery !== current) {
      const next = new URLSearchParams(searchParams)
      if (debouncedQuery) next.set('q', debouncedQuery)
      else next.delete('q')
      setSearchParams(next, { replace: true })
    }
  }, [debouncedQuery, searchParams, setSearchParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    productApi
      .getList({ search: debouncedQuery || undefined, limit: 24 })
      .then((res) => {
        if (!cancelled) setProducts(res.data)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const filtered = useMemo(() => {
    const chip = CHIPS.find((c) => c.id === activeChip)
    if (!chip || !chip.categorySlug) return products
    const slug = chip.categorySlug
    return products.filter(
      (p) => p.categorySlug === slug || p.category?.slug === slug,
    )
  }, [products, activeChip])

  const count = filtered.length
  const pluralized = useMemo(() => {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return 'товар'
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товара'
    return 'товаров'
  }, [count])

  return (
    <>
      <Helmet>
        <title>Поиск — Нексу</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.inner}>
          <label className={styles.searchBar}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className={styles.searchInput}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск материалов..."
              aria-label="Поиск материалов"
            />
          </label>

          <div className={styles.chips} role="tablist">
            {CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={activeChip === chip.id}
                className={clsx(
                  styles.chip,
                  activeChip === chip.id && styles.chipActive,
                )}
                onClick={() => setActiveChip(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className={styles.state}>Загрузка…</p>
          ) : (
            <>
              <p className={styles.counter}>
                Найдено {count} {pluralized}
              </p>

              {filtered.length === 0 ? (
                <p className={styles.state}>
                  {query
                    ? `По запросу «${query}» ничего не найдено`
                    : 'Ничего не найдено'}
                </p>
              ) : (
                <div className={styles.grid}>
                  {filtered.map((product) => {
                    const catSlug =
                      product.categorySlug || product.category?.slug || ''
                    const image = product.images[0] ?? '/images/placeholder.jpg'
                    return (
                      <Link
                        key={product.id}
                        to={`/catalog/${catSlug}/${product.slug}`}
                        className={styles.card}
                      >
                        <img
                          className={styles.cardImage}
                          src={image}
                          alt={product.name}
                          loading="lazy"
                        />
                        <div className={styles.cardBody}>
                          <h3 className={styles.cardName}>{product.name}</h3>
                          {product.priceFrom != null && (
                            <p className={styles.cardPrice}>
                              от {formatPrice(product.priceFrom)}
                              <span className={styles.cardPriceUnit}>
                                {DEFAULT_PRICE_UNIT}
                              </span>
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
