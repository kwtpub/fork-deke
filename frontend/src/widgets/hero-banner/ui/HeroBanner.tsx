import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bannerApi } from '@entities/banner'
import type { Banner } from '@entities/banner'
import { Spinner } from '@shared/ui/Spinner/Spinner'
import styles from './HeroBanner.module.scss'

export const HeroBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bannerApi.getActive().then(setBanners).catch(() => setBanners([])).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  if (loading) return <div className={styles.placeholder}><Spinner size="lg" /></div>
  if (!banners.length) return (
    <div className={styles.fallback}>
      <div className="container">
        <h1>Нексу — Искусство инноваций</h1>
        <p>Производитель фасадных материалов, кровли и водостоков</p>
        <Link to="/catalog" className={styles.cta}>Смотреть каталог</Link>
      </div>
    </div>
  )

  const banner = banners[current]
  return (
    <div className={styles.banner} style={{ backgroundImage: `url(${banner.image})` }}>
      <div className={styles.overlay} />
      <div className="container">
        <div className={styles.content}>
          <h1>{banner.title}</h1>
          {banner.subtitle && <p>{banner.subtitle}</p>}
          {banner.buttonText && banner.buttonLink && (
            <Link to={banner.buttonLink} className={styles.cta}>{banner.buttonText}</Link>
          )}
        </div>
      </div>
      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((_, i) => (
            <button key={i} className={i === current ? styles.dotActive : styles.dot} onClick={() => setCurrent(i)} />
          ))}
        </div>
      )}
    </div>
  )
}
