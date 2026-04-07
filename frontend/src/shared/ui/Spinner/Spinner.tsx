import styles from './Spinner.module.scss'
import clsx from 'clsx'

interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string }

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <div className={clsx(styles.spinner, styles[size], className)} />
)
