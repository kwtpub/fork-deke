import { type InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input ref={ref} className={clsx(styles.input, { [styles.hasError]: error }, className)} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  ),
)
Input.displayName = 'Input'
