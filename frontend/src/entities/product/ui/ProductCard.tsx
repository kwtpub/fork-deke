import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'
import { formatPriceFrom } from '@shared/lib/formatPrice'
import { addToCart } from '@features/cart/model/cartSlice'
import type { Product } from '../model/productTypes'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const dispatch = useDispatch()
  const catSlug = product.categorySlug || product.category?.slug || ''

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: catSlug,
      image: product.images[0] ?? '/images/placeholder.jpg',
      price: product.priceFrom ?? 0,
    }))
  }

  return (
    <Link
      to={`/catalog/${catSlug}/${product.slug}`}
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
        <div className={styles.bottom}>
          {product.priceFrom && (
            <p className={styles.price}>{formatPriceFrom(product.priceFrom)}</p>
          )}
          <button className={styles.cartBtn} onClick={handleAddToCart} title="В корзину">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
