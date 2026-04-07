import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { HeroBanner } from '@widgets/hero-banner'
import { NewsSection } from '@widgets/news-section'
import { ProductGrid } from '@widgets/product-grid'
import { CategoryCard, categoryApi } from '@entities/category'
import type { Category } from '@entities/category'
import { useEffect, useState } from 'react'
import styles from './HomePage.module.scss'

const FEATURES = [
  { icon: '🏆', title: 'Гарантия до 65 лет', desc: 'На отдельные виды продукции' },
  { icon: '🏭', title: 'Собственное производство', desc: 'Контроль качества на каждом этапе' },
  { icon: '🚚', title: 'Доставка по России', desc: 'Более 500 официальных дилеров' },
  { icon: '📞', title: 'Бесплатная консультация', desc: '8 800 100 71 45 — звонок бесплатный' },
]

export const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => { categoryApi.getTree().then(setCategories).catch(() => {}) }, [])

  return (
    <>
      <Helmet>
        <title>Döcke — Фасадные материалы, кровля, водостоки</title>
        <meta name="description" content="Производитель фасадных материалов, кровли и водостоков. Гарантия до 65 лет. Звоните: 8 800 100 71 45" />
      </Helmet>

      <HeroBanner />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Продукция</h2>
          <div className={styles.categories}>
            {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`section ${styles.features}`}>
        <div className="container">
          <h2 className="section-title">Почему выбирают Döcke</h2>
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

      {/* Featured products */}
      <section className="section">
        <div className="container">
          <ProductGrid title="Популярные товары" />
        </div>
      </section>

      <NewsSection />

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <h2>Нужна помощь в выборе?</h2>
          <p>Наши специалисты помогут подобрать оптимальное решение</p>
          <Link to="/contacts" className={styles.ctaBtn}>Получить консультацию</Link>
        </div>
      </section>
    </>
  )
}
