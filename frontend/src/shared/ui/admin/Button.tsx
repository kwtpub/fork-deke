import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

export type AdminButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type AdminButtonSize = 'sm' | 'md'

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant
  size?: AdminButtonSize
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
}: AdminButtonProps) => (
  <button
    className={clsx(
      styles.button,
      styles[variant],
      styles[size],
      { [styles.loading]: loading },
      className,
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className={styles.spinner} aria-hidden="true" /> : children}
  </button>
)
