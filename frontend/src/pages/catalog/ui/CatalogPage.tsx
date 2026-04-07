import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CategoryCard, categoryApi } from '@entities/category'
import type { Category } from '@entities/category'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import styles from './CatalogPage.module.scss'

export const CatalogPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => { categoryApi.getTree().then(setCategories) }, [])

  return (
    <>
      <Helmet><title>Каталог продукции — Döcke</title></Helmet>
      <div className="container" style={{ padding: '40px 20px' }}>
        <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]} />
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '24px 0 32px' }}>Каталог продукции</h1>
        <div className={styles.grid}>
          {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
        </div>
      </div>
    </>
  )
}
