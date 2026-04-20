import { type ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { StoreProvider } from './StoreProvider'
import { ToastProvider, ConfirmProvider } from '@shared/ui/admin'

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>
    <StoreProvider>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </StoreProvider>
  </HelmetProvider>
)
