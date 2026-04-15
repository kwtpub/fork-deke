import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Button } from '@shared/ui/Button/Button'
import { FileUpload } from '@shared/ui/FileUpload'

interface Category {
  id: string
  name: string
  slug: string
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#424242',
  marginBottom: 6,
}

export const AdminProductNewPage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    priceFrom: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    images: [] as string[],
  })

  useEffect(() => {
    apiInstance.get('/categories')
      .then((r) => setCategories(r.data?.data ?? []))
      .catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-zа-я0-9\s-]/gi, '').replace(/\s+/g, '-').replace(/-+/g, '-')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: autoSlug(name) }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Укажите название продукта')
    if (!form.slug.trim()) return setError('Укажите slug')
    if (!form.categoryId) return setError('Выберите категорию')

    setLoading(true)
    try {
      await apiInstance.post('/products', {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        priceFrom: form.priceFrom ? parseFloat(form.priceFrom) : null,
        categoryId: form.categoryId,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        images: form.images,
      })
      navigate('/admin/products')
    } catch (err: any) {
      const msg = err?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Ошибка при создании продукта'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Новый продукт — Нексу Admin</title></Helmet>

      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate('/admin/products')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575', fontSize: 14, padding: 0, marginBottom: 12 }}
        >
          ← Назад к продуктам
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121' }}>Новый продукт</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            <label style={labelStyle}>Название *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Например: Нексу STANDART"
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="docke-standart"
              style={fieldStyle}
            />
            <p style={{ fontSize: 12, color: '#9e9e9e', marginTop: 4 }}>Используется в URL. Только латиница, цифры и дефисы.</p>
          </div>

          <div>
            <label style={labelStyle}>Категория *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} style={fieldStyle}>
              <option value="">— Выберите категорию —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Описание</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Краткое описание продукта"
              rows={4}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Цена от (₽)</label>
            <input
              name="priceFrom"
              type="number"
              min="0"
              value={form.priceFrom}
              onChange={handleChange}
              placeholder="0"
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Изображения товара</label>
            <FileUpload
              folder="products"
              onUpload={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
            />
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              Активен
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              Рекомендуемый
            </label>
          </div>

          {error && (
            <p style={{ color: '#c62828', fontSize: 13, background: '#fce4ec', padding: '10px 14px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Сохранение...' : 'Создать продукт'}
            </Button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              style={{
                padding: '10px 20px', border: '1px solid #e0e0e0',
                borderRadius: 8, cursor: 'pointer', fontSize: 14,
                background: '#fff', color: '#424242',
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
