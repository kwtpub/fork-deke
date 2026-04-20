import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@widgets/header'
import { HomePage } from '@pages/home'
import { CatalogPage, CatalogCategoryPage } from '@pages/catalog'
import { ProductPage } from '@pages/product'
import { AboutPage } from '@pages/about'
import { ContactsPage } from '@pages/contacts'
import { DocsPage } from '@pages/docs'
import { CalculatorPage } from '@pages/calculator'
import { SearchPage } from '@pages/search'
import { NewsPage, NewsDetailPage } from '@pages/news'
import { CartPage } from '@pages/cart'
import { NotFoundPage } from '@pages/not-found'
import {
  AdminLoginPage, AdminLayout, AdminDashboard,
  AdminProductsPage, AdminProductNewPage, AdminProductEditPage,
  AdminNewsPage, AdminNewsNewPage, AdminNewsEditPage, AdminOrdersPage,
  AdminBannersPage, AdminCategoriesPage, AdminDocumentsPage,
} from '@pages/admin'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:slug', element: <CatalogCategoryPage /> },
      { path: 'catalog/:categorySlug/:productSlug', element: <ProductPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'docs', element: <DocsPage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductNewPage /> },
          { path: 'products/:id/edit', element: <AdminProductEditPage /> },
          { path: 'news', element: <AdminNewsPage /> },
          { path: 'news/new', element: <AdminNewsNewPage /> },
          { path: 'news/:id/edit', element: <AdminNewsEditPage /> },
          { path: 'banners', element: <AdminBannersPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'documents', element: <AdminDocumentsPage /> },
        ],
      },
    ],
  },
])
