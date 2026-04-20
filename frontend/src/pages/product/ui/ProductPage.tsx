import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { productApi } from '@entities/product'
import type { Product, ProductColor } from '@entities/product'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Spinner } from '@shared/ui/Spinner/Spinner'
import { ROUTES } from '@shared/config/constants'
import { OrderModal } from '@features/order-modal/ui/OrderModal'
import { addToCart } from '@features/cart/model/cartSlice'
import styles from './ProductPage.module.scss'

// Inline lucide-style icon
const Icon = ({ name, size = 24, color = 'currentColor' }: { name: string; size?: number; color?: string }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'eye':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 2.6-2.6z" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
          <path d="M19 14l.8 1.9 1.9.8-1.9.8L19 19.5l-.8-1.9-1.9-.8 1.9-.8L19 14z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'palette':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="13.5" cy="6.5" r="1.2" />
          <circle cx="17.5" cy="10.5" r="1.2" />
          <circle cx="8.5" cy="7.5" r="1.2" />
          <circle cx="6.5" cy="12.5" r="1.2" />
          <path d="M12 22a10 10 0 1 1 10-10c0 2-2 3-4 3h-2a2 2 0 0 0-1 4 2 2 0 0 1-1 3 3 3 0 0 1-2 0z" />
        </svg>
      )
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    default:
      return null
  }
}

const BENEFITS = [
  { icon: 'eye', label: 'Выглядят как камень' },
  { icon: 'wrench', label: 'Легко монтируются' },
  { icon: 'clock', label: 'Долго служат' },
  { icon: 'sun', label: 'Не выцветают' },
  { icon: 'sparkles', label: 'Не требуют ухода' },
]

const FALLBACK_SPECS: Array<[string, string]> = [
  ['Рабочая длина', '1055 мм'],
  ['Рабочая ширина', '480 мм'],
  ['Рабочая площадь', '0,50 м²'],
  ['Высота профиля', '25 мм'],
  ['Толщина материала', '18 мм'],
  ['Вес брутто', '21,2 кг'],
  ['Размеры упаковки', '1230 × 475 × 285 мм'],
]

const FALLBACK_DESCRIPTION =
  'Фасадные панели коллекции Штейн имитируют кладку из слоистого песчаника. Уникальная текстура создаёт впечатление натурального камня. Панели устойчивы к воздействию ультрафиолета, перепадам температур и механическим повреждениям. Гарантия от деформации — 50 лет.'

const FALLBACK_COLORS: ProductColor[] = [
  { id: 'c1', name: 'Песочный', hex: '#d9b68a' },
  { id: 'c2', name: 'Коричневый', hex: '#8d5a3b' },
  { id: 'c3', name: 'Тёмный орех', hex: '#5a3a24' },
  { id: 'c4', name: 'Графит', hex: '#3a3734' },
  { id: 'c5', name: 'Антрацит', hex: '#2a2a2a' },
]

export const ProductPage = () => {
  const { categorySlug = '', productSlug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [activeColorId, setActiveColorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderOpen, setOrderOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    productApi
      .getBySlug(categorySlug, productSlug)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [categorySlug, productSlug])

  const colors = useMemo(() => {
    const fromSeries = product?.series?.flatMap((s) => s.colors) ?? []
    return fromSeries.length > 0 ? fromSeries : FALLBACK_COLORS
  }, [product])

  useEffect(() => {
    if (colors.length > 0 && !activeColorId) setActiveColorId(colors[0].id)
  }, [colors, activeColorId])

  if (loading)
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
      </div>
    )
  if (!product)
    return (
      <div className="container">
        <div className={styles.notFound}>Продукт не найден</div>
      </div>
    )

  const images = product.images.length > 0 ? product.images : ['/images/placeholder.jpg']
  const mainImage = images[activeImage] ?? images[0]

  const specEntries: Array<[string, string]> =
    Object.keys(product.specifications ?? {}).length > 0
      ? Object.entries(product.specifications)
      : FALLBACK_SPECS

  const description = product.description || FALLBACK_DESCRIPTION
  const article = (product as { article?: string }).article ?? `FP${product.id.slice(0, 2).toUpperCase()}-${product.id.slice(-4).toUpperCase()}`
  const price = product.priceFrom ?? 807

  const handleBuy = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        categorySlug: product.categorySlug || product.category?.slug || '',
        image: mainImage,
        price,
      }),
    )
    setOrderOpen(true)
  }

  return (
    <>
      <Helmet>
        <title>{product.name} — Нексу</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className={styles.page}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Каталог', href: ROUTES.CATALOG },
              {
                label: product.category?.name ?? product.categorySlug,
                href: `/catalog/${product.categorySlug || product.category?.slug}`,
              },
              { label: product.name },
            ]}
          />

          <section className={styles.hero}>
            <div className={styles.heroLeft}>
              <div className={styles.mainImage}>
                <img src={mainImage} alt={product.name} />
              </div>
              {images.length > 1 && (
                <div className={styles.thumbRow}>
                  {images.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      className={i === activeImage ? styles.thumbActive : styles.thumb}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Изображение ${i + 1}`}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.heroRight}>
              <h1 className={styles.title}>{product.name}</h1>
              <div className={styles.article}>Артикул: {article}</div>

              <div className={styles.ratingRow}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" size={16} color={i < 4 ? '#FFB800' : '#DDDDDD'} />
                ))}
                <span className={styles.ratingText}>4.0 (44 отзыва)</span>
              </div>

              <div className={styles.priceRow}>
                <div className={styles.priceText}>{price.toLocaleString('ru-RU')} ₽ / шт</div>
                <div className={styles.priceNote}>*рекомендованная цена</div>
              </div>

              <div className={styles.divider} />

              <div className={styles.colorSection}>
                <div className={styles.colorLabel}>Цвет:</div>
                <div className={styles.colorRow}>
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={c.id === activeColorId ? styles.colorSwatchActive : styles.colorSwatch}
                      onClick={() => setActiveColorId(c.id)}
                      title={c.name}
                      aria-label={c.name}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.btnGroup}>
                <button type="button" className={styles.btnPrimary} onClick={handleBuy}>
                  Купить онлайн
                </button>
                <button type="button" className={styles.btnOutline} onClick={() => setOrderOpen(true)}>
                  Тираж продукта
                </button>
                <Link to={ROUTES.CALCULATOR} className={styles.btnOutline}>
                  Калькулятор
                </Link>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.benefits}>
          <div className="container">
            <div className={styles.benefitsGrid}>
              {BENEFITS.map((b) => (
                <div key={b.label} className={styles.benefit}>
                  <Icon name={b.icon} size={32} color="#D71920" />
                  <span className={styles.benefitLabel}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.specs}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Характеристики</h2>
            <div className={styles.specsTable}>
              {specEntries.map(([k, v], i) => (
                <div key={k} className={i % 2 === 0 ? styles.specRowAlt : styles.specRow}>
                  <span className={styles.specLabel}>{k}</span>
                  <span className={styles.specValue}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.description}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Описание</h2>
            <p className={styles.descriptionText}>{description}</p>
          </div>
        </section>

        <section className={styles.warranty}>
          <div className="container">
            <div className={styles.warrantyGrid}>
              <div className={styles.warrantyCard}>
                <Icon name="shield" size={32} color="#D71920" />
                <div className={styles.warrantyText}>
                  <div className={styles.warrantyTitle}>50 лет</div>
                  <div className={styles.warrantySub}>гарантия от деформации</div>
                </div>
              </div>
              <div className={styles.warrantyCard}>
                <Icon name="palette" size={32} color="#D71920" />
                <div className={styles.warrantyText}>
                  <div className={styles.warrantyTitle}>7 лет</div>
                  <div className={styles.warrantySub}>стабильность цвета</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <OrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        productId={product.id}
        productName={product.name}
      />
    </>
  )
}
