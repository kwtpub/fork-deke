import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { productApi } from '@entities/product'
import type { Product } from '@entities/product'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Spinner } from '@shared/ui/Spinner/Spinner'
import { Button } from '@shared/ui/Button/Button'
import { formatPriceFrom } from '@shared/lib/formatPrice'
import { OrderModal } from '@features/order-modal/ui/OrderModal'
import { addToCart } from '@features/cart/model/cartSlice'
import styles from './ProductPage.module.scss'

const FEATURES = [
  { icon: '🏆', title: 'Гарантия качества', desc: 'До 65 лет на отдельные виды продукции' },
  { icon: '🏭', title: 'Собственное производство', desc: 'Контроль на каждом этапе' },
  { icon: '📦', title: 'В наличии', desc: 'Быстрая доставка по России' },
  { icon: '💬', title: 'Консультация', desc: 'Поможем с выбором' },
]

export const ProductPage = () => {
  const { categorySlug = '', productSlug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [activeSeries, setActiveSeries] = useState(0)
  const [loading, setLoading] = useState(true)
  const [orderOpen, setOrderOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    productApi.getBySlug(categorySlug, productSlug).then(setProduct).finally(() => setLoading(false))
  }, [categorySlug, productSlug])

  if (loading) return <div className={styles.loading}><Spinner size="lg" /></div>
  if (!product) return <div className="container"><div className={styles.notFound}>Продукт не найден</div></div>

  const series = product.series[activeSeries]

  return (
    <>
      <Helmet>
        <title>{product.name} — Döcke</title>
        <meta name="description" content={product.description ?? `${product.name} от Döcke`} />
      </Helmet>

      <div className={styles.page}>
        <div className="container">
          <Breadcrumb items={[
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog' },
            { label: product.category?.name ?? product.categorySlug, href: `/catalog/${product.categorySlug || product.category?.slug}` },
            { label: product.name },
          ]} />

          <div className={styles.layout}>
            {/* Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <img src={product.images[activeImage] ?? '/images/placeholder.jpg'} alt={product.name} />
              </div>
              {product.images.length > 1 && (
                <div className={styles.thumbs}>
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      className={i === activeImage ? styles.thumbActive : styles.thumb} 
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              <h1 className={styles.name}>{product.name}</h1>
              {product.category && (
                <Link to={`/catalog/${product.categorySlug || product.category?.slug}`} className={styles.category}>
                  {product.category.name}
                </Link>
              )}
              {product.priceFrom && <div className={styles.price}>{formatPriceFrom(product.priceFrom)}</div>}
              {product.description && <p className={styles.description}>{product.description}</p>}

              {/* Series tabs */}
              {product.series.length > 0 && (
                <div className={styles.seriesSection}>
                  <h3 className={styles.sectionTitle}>Доступные серии</h3>
                  <div className={styles.seriesTabs}>
                    {product.series.map((s, i) => (
                      <button 
                        key={s.id} 
                        className={i === activeSeries ? styles.seriesTabActive : styles.seriesTab}
                        onClick={() => setActiveSeries(i)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  {series && series.colors.length > 0 && (
                    <div className={styles.colorsSection}>
                      <h4 className={styles.subsectionTitle}>Доступные цвета: {series.colors.length}</h4>
                      <div className={styles.colorList}>
                        {series.colors.map((c) => (
                          <div key={c.id} className={styles.colorItem} title={c.name}>
                            <span className={styles.colorSwatch} style={{ background: c.hex }} />
                            <span className={styles.colorName}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.actions}>
                <Button size="lg" onClick={() => {
                  dispatch(addToCart({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    categorySlug: product.categorySlug || product.category?.slug || '',
                    image: product.images[0] ?? '/images/placeholder.jpg',
                    price: product.priceFrom ?? 0,
                  }))
                  setAddedToCart(true)
                  setTimeout(() => setAddedToCart(false), 2000)
                }}>
                  {addedToCart ? 'Добавлено ✓' : 'В корзину'}
                </Button>
                <Button variant="outline" size="lg" onClick={() => setOrderOpen(true)}>
                  Оставить заявку
                </Button>
              </div>

              <div className={styles.contact}>
                <p className={styles.contactLabel}>Есть вопросы? Позвоните нам</p>
                <a href="tel:88001007145" className={styles.contactPhone}>8 800 100 71 45</a>
                <p className={styles.contactNote}>Звонок по России бесплатный</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.featuresGrid}>
              {FEATURES.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specs */}
        {Object.keys(product.specifications).length > 0 && (
          <section className={styles.specsSection}>
            <div className="container">
              <h2 className={styles.specsTitle}>Технические характеристики</h2>
              <div className={styles.specsTable}>
                <table>
                  <tbody>
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <tr key={k}>
                        <th>{k}</th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <h2>Готовы сделать заказ?</h2>
            <p>Оставьте заявку, и наш менеджер свяжется с вами в ближайшее время</p>
            <Button size="lg" onClick={() => setOrderOpen(true)}>
              Получить консультацию
            </Button>
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
