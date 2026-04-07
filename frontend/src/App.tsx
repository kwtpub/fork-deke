import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { StoreProvider } from './app/providers/StoreProvider'
import { router } from './app/routes'
import '../src/shared/styles/index.scss'

function App() {
  return (
    <HelmetProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </HelmetProvider>
  )
}

export default App
