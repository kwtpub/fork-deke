import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { categoryApi } from '@entities/category'
import type { Category } from '@entities/category'
import { ProductGrid } from '@widgets/product-grid'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Spinner } from '@shared/ui/Spinner/Spinner'

export const CatalogCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    categoryApi.getBySlug(slug).then(setCategory).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size="lg" /></div>
  if (!category) return <div className="container" style={{ padding: 40 }}>Категория не найдена</div>

  return (
    <>
      <Helmet><title>{category.name} — Döcke</title></Helmet>
      <div className="container" style={{ padding: '40px 20px' }}>
        <Breadcrumb items={[
          { label: 'Главная', href: '/' },
          { label: 'Каталог', href: '/catalog' },
          { label: category.name },
        ]} />
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '24px 0 32px' }}>{category.name}</h1>
        {category.description && <p style={{ fontSize: 16, color: '#616161', marginBottom: 32 }}>{category.description}</p>}
        <ProductGrid params={{ categorySlug: slug }} />
      </div>
    </>
  )
}
