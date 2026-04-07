import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { formatPriceFrom } from '@shared/lib/formatPrice'
import type { Product } from '../model/productTypes'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard = ({ product, className }: ProductCardProps) => (
  <Link
    to={`/catalog/${product.categorySlug}/${product.slug}`}
    className={clsx(styles.card, className)}
  >
    <div className={styles.imageWrap}>
      <img
        src={product.images[0] ?? '/images/placeholder.jpg'}
        alt={product.name}
        loading="lazy"
      />
      {product.isFeatured && <span className={styles.badge}>Хит</span>}
    </div>
    <div className={styles.info}>
      <h3 className={styles.name}>{product.name}</h3>
      {product.series.length > 0 && (
        <p className={styles.series}>{product.series.length} серии</p>
      )}
      {product.priceFrom && (
        <p className={styles.price}>{formatPriceFrom(product.priceFrom)}</p>
      )}
    </div>
  </Link>
)
