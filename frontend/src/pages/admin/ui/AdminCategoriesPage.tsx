import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'
import type { Category } from '@entities/category'

type FormState = {
  name: string
  slug: string
  description: string
  image: string
  icon: string
  sortOrder: number
  parentId: string
}

const EMPTY: FormState = { name: '', slug: '', description: '', image: '', icon: '', sortOrder: 0, parentId: '' }

const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

type FlatCategory = Category & { depth: number }

const flattenTree = (cats: Category[], depth = 0): FlatCategory[] =>
  cats.flatMap((c) => [{ ...c, depth }, ...flattenTree(c.children ?? [], depth + 1)])

const fieldStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fff',
}

export const AdminCategoriesPage = () => {
  const [flat, setFlat] = useState<FlatCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  const load = () => {
    setLoading(true)
    apiInstance.get(`/categories?t=${Date.now()}`)
      .then((r) => {
        const data: Category[] = r.data?.data ?? []
        setFlat(flattenTree(data))
      })
      .catch(() => setFlat([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditId(null)
    setSlugManual(false)
    setError('')
    setShowForm(true)
  }

  const openEdit = (c: FlatCategory) => {
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      image: c.image ?? '',
      icon: c.icon ?? '',
      sortOrder: c.sortOrder ?? 0,
      parentId: c.parentId ?? '',
    })
    setEditId(c.id)
    setSlugManual(true)
    setError('')
    setShowForm(true)
  }

  const closeForm = () => { setShowForm(false); setEditId(null) }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : toSlug(name),
    }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManual(true)
    setForm((prev) => ({ ...prev, slug: e.target.value }))
  }

  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = field === 'sortOrder' ? Number(e.target.value) : e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSave = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Укажите название')
    if (!form.slug.trim()) return setError('Укажите slug')

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image.trim() || null,
        icon: form.icon.trim() || null,
        sortOrder: form.sortOrder,
        parentId: form.parentId || null,
      }
      if (editId) {
        await apiInstance.patch(`/categories/${editId}`, payload)
      } else {
        await apiInstance.post('/categories', payload)
      }
      load()
      closeForm()
    } catch (err: any) {
      const msg = err?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Ошибка при сохранении'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить категорию «${name}»? Подкатегории станут корневыми.`)) return
    try {
      await apiInstance.delete(`/categories/${id}`)
      load()
    } catch {
      alert('Не удалось удалить категорию')
    }
  }

  // Список для select родителей: исключаем саму себя и её потомков
  const parentOptions = flat.filter((c) => {
    if (!editId) return true
    if (c.id === editId) return false
    // Исключаем потомков редактируемой категории
    let cur: FlatCategory | undefined = c
    while (cur?.parentId) {
      if (cur.parentId === editId) return false
      cur = flat.find((x) => x.id === cur!.parentId)
    }
    return true
  })

  return (
    <>
      <Helmet><title>Категории — Нексу Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121' }}>Категории</h1>
          <p style={{ color: '#757575', fontSize: 14 }}>{flat.length} категорий</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ Добавить категорию</Button>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Таблица категорий */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <p style={{ color: '#757575', padding: '40px 0' }}>Загрузка...</p>
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
                    {['Название', 'Slug', 'Порядок', 'Действия'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#757575', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flat.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: i < flat.length - 1 ? '1px solid #f0f0f0' : 'none',
                        background: editId === c.id ? '#fff8e1' : '#fff',
                      }}
                    >
                      <td style={{ padding: '12px 16px', paddingLeft: 16 + c.depth * 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {c.depth > 0 && <span style={{ color: '#bdbdbd' }}>└</span>}
                          {c.image && (
                            <img src={c.image} alt="" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                          )}
                          {c.icon && !c.image && (
                            <span style={{ fontSize: 18 }}>{c.icon}</span>
                          )}
                          <span style={{ fontWeight: c.depth === 0 ? 700 : 400, color: '#212121' }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#757575', fontSize: 12, fontFamily: 'monospace' }}>{c.slug}</td>
                      <td style={{ padding: '12px 16px', color: '#9e9e9e', fontSize: 13 }}>{c.sortOrder}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => openEdit(c)}
                            style={{ padding: '5px 12px', border: '1px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#424242' }}
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            style={{ padding: '5px 12px', border: '1px solid #ffcdd2', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#c62828' }}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {flat.length === 0 && (
                <p style={{ textAlign: 'center', color: '#9e9e9e', padding: '40px 0' }}>Категорий нет</p>
              )}
            </div>
          )}
        </div>

        {/* Боковая форма */}
        {showForm && (
          <div style={{ width: 400, flexShrink: 0 }}>
            <form
              onSubmit={handleSave}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#212121' }}>
                  {editId ? 'Редактировать' : 'Новая категория'}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9e9e9e', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              <Input
                label="Название *"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Например: Водосточные системы"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>Slug *</label>
                <input
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="vodostochnye-sistemy"
                  style={fieldStyle}
                />
                <p style={{ fontSize: 11, color: '#9e9e9e' }}>Автозаполняется из названия. Только латиница и дефисы.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>Родительская категория</label>
                <select
                  value={form.parentId}
                  onChange={handleChange('parentId')}
                  style={fieldStyle}
                >
                  <option value="">— Корневая категория —</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {'  '.repeat(c.depth)}{c.depth > 0 ? '└ ' : ''}{c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>Описание</label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Краткое описание категории"
                  rows={3}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>URL изображения</label>
                <input
                  value={form.image}
                  onChange={handleChange('image')}
                  placeholder="https://..."
                  style={fieldStyle}
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0e0e0' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
              </div>

              <Input
                label="Иконка (эмодзи или символ)"
                value={form.icon}
                onChange={handleChange('icon')}
                placeholder="🏠"
              />

              <Input
                label="Порядок сортировки"
                type="number"
                value={String(form.sortOrder)}
                onChange={handleChange('sortOrder')}
              />

              {error && (
                <p style={{ color: '#c62828', fontSize: 13, background: '#fce4ec', padding: '10px 14px', borderRadius: 8, margin: 0 }}>
                  {error}
                </p>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <Button type="submit" variant="primary" loading={saving}>
                  {editId ? 'Сохранить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
