import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(styles.button, styles[variant], styles[size], { [styles.loading]: loading }, className)}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className={styles.spinner} /> : children}
  </button>
)
