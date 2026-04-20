import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './app/providers'
import { router } from './app/routes'
import '../src/shared/styles/index.scss'

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
