import { type HTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Card.module.scss'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
}

export const Card = ({ children, className, padded = true, ...rest }: CardProps) => (
  <div className={clsx(styles.card, { [styles.padded]: padded }, className)} {...rest}>
    {children}
  </div>
)
