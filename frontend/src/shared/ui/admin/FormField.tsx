import { type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './FormField.module.scss'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export const FormField = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) => (
  <div className={clsx(styles.field, className)}>
    {label && (
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
    )}
    <div className={clsx(styles.control, { [styles.hasError]: Boolean(error) })}>{children}</div>
    {error ? (
      <p className={styles.error}>{error}</p>
    ) : hint ? (
      <p className={styles.hint}>{hint}</p>
    ) : null}
  </div>
)
