import { type ReactNode } from 'react'
import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className={styles.header}>
    <div className={styles.textBlock}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    {action && <div className={styles.action}>{action}</div>}
  </div>
)
