import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Button } from './Button'
import styles from './ConfirmDialog.module.scss'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

interface PendingState {
  options: ConfirmOptions
  resolve: (value: boolean) => void
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingState | null>(null)
  const pendingRef = useRef<PendingState | null>(null)
  pendingRef.current = pending

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve })
    })
  }, [])

  const close = useCallback((value: boolean) => {
    const current = pendingRef.current
    if (current) {
      current.resolve(value)
      setPending(null)
    }
  }, [])

  const value = useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {pending && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={() => close(false)}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.title}>{pending.options.title}</h2>
            {pending.options.message && (
              <p className={styles.message}>{pending.options.message}</p>
            )}
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => close(false)}>
                {pending.options.cancelText ?? 'Отмена'}
              </Button>
              <Button
                variant={pending.options.destructive ? 'danger' : 'primary'}
                onClick={() => close(true)}
                autoFocus
              >
                {pending.options.confirmText ?? 'Подтвердить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export const useConfirm = (): ConfirmContextValue['confirm'] => {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within <ConfirmProvider>')
  return ctx.confirm
}
