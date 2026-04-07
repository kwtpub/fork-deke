import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.scss'

interface BreadcrumbItem { label: string; href?: string }
interface BreadcrumbProps { items: BreadcrumbItem[] }

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className={styles.breadcrumb} aria-label="Breadcrumb">
    <ol>
      {items.map((item, idx) => (
        <li key={idx}>
          {item.href && idx < items.length - 1 ? (
            <Link to={item.href}>{item.label}</Link>
          ) : (
            <span aria-current={idx === items.length - 1 ? 'page' : undefined}>{item.label}</span>
          )}
          {idx < items.length - 1 && <span className={styles.sep}>/</span>}
        </li>
      ))}
    </ol>
  </nav>
)
