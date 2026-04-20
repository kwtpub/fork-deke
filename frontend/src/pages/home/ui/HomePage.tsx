import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PATHS } from '@app/routes/paths'
import { bannerApi } from '@entities/banner'
import type { Banner } from '@entities/banner'
import { newsApi } from '@entities/news'
import type { News } from '@entities/news'
import { productApi } from '@entities/product'
import type { Product } from '@entities/product'
import styles from './HomePage.module.scss'

const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80'

const CATEGORIES_FALLBACK = [
  {
    name: 'Металлочерепица',
    slug: 'metallocherepitsa',
    image:
      'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Фасадные панели',
    slug: 'fasadnye-paneli',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Водосточные системы',
    slug: 'vodostochnye-sistemy',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Сайдинг',
    slug: 'sayding',
    image:
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Заборы',
    slug: 'zabory',
    image:
      'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Кровельные аксессуары',
    slug: 'aksessuary',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
  },
]

const PROMOS_FALLBACK = [
  {
    id: 'p1',
    title: 'Новая коллекция фасадов',
    description: 'Современные решения для энергоэффективных домов',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p2',
    title: 'Скидка 15% на металлочерепицу',
    description: 'Только до конца месяца на серию премиум-класса',
    image:
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p3',
    title: 'Бесплатный расчёт кровли',
    description: 'Замер и проект для частных домов по Москве',
    image:
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
  },
]

const ARTICLES_FALLBACK = [
  {
    id: 'a1',
    title: 'Как выбрать металлочерепицу для дома',
    excerpt: 'Разбираем толщину, покрытия и геометрию профиля.',
  },
  {
    id: 'a2',
    title: 'Монтаж фасадных панелей своими руками',
    excerpt: 'Пошаговое руководство с ключевыми ошибками новичков.',
  },
  {
    id: 'a3',
    title: 'Гарантия 50 лет: что она реально значит',
    excerpt: 'Условия, исключения и когда стоит её оформлять.',
  },
  {
    id: 'a4',
    title: 'Водосток: пластик или металл?',
    excerpt: 'Сравнение по цене, долговечности и обслуживанию.',
  },
  {
    id: 'a5',
    title: 'Сайдинг и сезонность монтажа',
    excerpt: 'Что учитывать при установке зимой и летом.',
  },
  {
    id: 'a6',
    title: 'Энергоэффективная кровля в 2026',
    excerpt: 'Тренды, материалы и окупаемость решений.',
  },
]

const QUALITY_ITEMS = [
  {
    title: 'Собственное производство',
    desc: 'Контроль на каждом этапе',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1" />
        <path d="M12 18h1" />
        <path d="M7 18h1" />
      </svg>
    ),
  },
  {
    title: 'Гарантия качества',
    desc: 'Сертифицированная продукция',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Патентованные технологии',
    desc: 'Инновационные решения',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
        <circle cx="12" cy="8" r="6" />
      </svg>
    ),
  },
  {
    title: '300+ партнёров',
    desc: '31 представительство по России',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

export const HomePage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [news, setNews] = useState<News[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    bannerApi.getActive().then(setBanners).catch(() => setBanners([]))
    newsApi.getList({ limit: 3 }).then((r) => setNews(r.data)).catch(() => setNews([]))
    productApi
      .getList({ limit: 3 })
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
  }, [])

  const heroBanner = banners[0]
  const heroImage = heroBanner?.image || HERO_FALLBACK_IMAGE

  const promoItems =
    products.length >= 3
      ? products.slice(0, 3).map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description || 'Новинка в каталоге НЕКСУ',
          image: p.images[0] || PROMOS_FALLBACK[0].image,
        }))
      : PROMOS_FALLBACK

  const newsItems =
    news.length >= 3
      ? news.slice(0, 3)
      : [
          {
            id: 'n1',
            title: 'НЕКСУ открывает новое представительство',
            excerpt: 'Расширяем сеть — теперь нас больше в регионах.',
            slug: 'new-office',
            coverImage:
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          },
          {
            id: 'n2',
            title: 'Обновление линейки металлочерепицы',
            excerpt: 'Новые профили и покрытия — больше выбора для клиентов.',
            slug: 'new-metallocherepitsa',
            coverImage:
              'https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&w=1200&q=80',
          },
          {
            id: 'n3',
            title: 'Партнёрская программа 2026',
            excerpt: 'Условия сотрудничества и бонусы для дилеров.',
            slug: 'partners-2026',
            coverImage:
              'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
          },
        ]

  return (
    <>
      <Helmet>
        <title>НЕКСУ — Искусство строительства</title>
        <meta
          name="description"
          content="Стильные, качественные, доступные решения для строительства и ремонта. Фасадные материалы, кровля, водостоки."
        />
      </Helmet>

      {/* 1. HERO */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>НЕКСУ</h1>
          <p className={styles.heroSubtitle}>Искусство строительства</p>
          <p className={styles.heroDescription}>
            Стильные, качественные, доступные решения для строительства и ремонта
          </p>
          <div className={styles.heroActions}>
            <Link to={PATHS.CATALOG} className={styles.btnPrimary}>
              Каталог
            </Link>
            <Link to={PATHS.ABOUT} className={styles.btnOutline}>
              О нас
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PROMOS */}
      <section className={styles.promos}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Новинки и акции</h2>
          <div className={styles.promoGrid}>
            {promoItems.map((item) => (
              <article key={item.id} className={styles.promoCard}>
                <div
                  className={styles.promoImage}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className={styles.promoBody}>
                  <h3 className={styles.promoTitle}>{item.title}</h3>
                  <p className={styles.promoDesc}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUALITY */}
      <section className={styles.quality}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Качество НЕКСУ</h2>
          <div className={styles.qualityGrid}>
            {QUALITY_ITEMS.map((item) => (
              <div key={item.title} className={styles.qualityCard}>
                <span className={styles.qualityIcon}>{item.icon}</span>
                <h3 className={styles.qualityTitle}>{item.title}</h3>
                <p className={styles.qualityDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES */}
      <section className={styles.categories}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Продукция</h2>
          <div className={styles.categoryGrid}>
            {CATEGORIES_FALLBACK.map((c) => (
              <Link
                key={c.slug}
                to={PATHS.CATALOG_CATEGORY(c.slug)}
                className={styles.categoryTile}
                style={{ backgroundImage: `url(${c.image})` }}
              >
                <span className={styles.categoryOverlay} />
                <span className={styles.categoryLabel}>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEWS */}
      <section className={styles.news}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Новости</h2>
          <div className={styles.newsGrid}>
            {newsItems.map((n) => (
              <Link
                key={n.id}
                to={PATHS.NEWS_DETAIL(n.slug)}
                className={styles.newsCard}
              >
                <div
                  className={styles.newsImage}
                  style={{
                    backgroundImage: `url(${
                      n.coverImage ||
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
                    })`,
                  }}
                />
                <div className={styles.newsBody}>
                  <h3 className={styles.newsTitle}>{n.title}</h3>
                  <p className={styles.newsDesc}>{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ARTICLES */}
      <section className={styles.articles}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Популярные статьи</h2>
          <div className={styles.articleGrid}>
            {ARTICLES_FALLBACK.map((a) => (
              <article key={a.id} className={styles.articleCard}>
                <h3 className={styles.articleTitle}>{a.title}</h3>
                <p className={styles.articleDesc}>{a.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
