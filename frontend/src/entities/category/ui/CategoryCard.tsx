import { Link } from 'react-router-dom'
import type { Category } from '../model/categoryTypes'
import styles from './CategoryCard.module.scss'

export const CategoryCard = ({ category }: { category: Category }) => (
  <Link to={`/catalog/${category.slug}`} className={styles.card}>
    {category.image && <img src={category.image} alt={category.name} />}
    <h3>{category.name}</h3>
    {category.productsCount && <p>{category.productsCount} товаров</p>}
  </Link>
)
