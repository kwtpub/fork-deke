import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'
import type { Banner } from '@entities/banner'

type Mode = 'list' | 'edit'
const EMPTY = { title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', sortOrder: 0, isActive: true }

export const AdminBannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    apiInstance.get('/banners')
      .then((r) => setBanners(r.data?.data ?? []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startEdit = (b: Banner) => {
    setForm({ title: b.title, subtitle: b.subtitle ?? '', buttonText: b.buttonText ?? '', buttonLink: b.buttonLink ?? '', image: b.image, sortOrder: b.sortOrder ?? 0, isActive: b.isActive })
    setEditId(b.id)
    setMode('edit')
  }

  const startCreate = () => { setForm(EMPTY); setEditId(null); setMode('edit') }

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await apiInstance.patch(`/banners/${editId}`, form)
      } else {
        await apiInstance.post('/banners', form)
      }
      load(); setMode('list')
    } catch { alert('Ошибка') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить баннер?')) return
    await apiInstance.delete(`/banners/${id}`)
    load()
  }

  const f = (field: string) => (e: { target: { value: string } }) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  if (mode === 'edit') return (
    <>
      <Helmet><title>{editId ? 'Редактировать баннер' : 'Новый баннер'} — Admin</title></Helmet>
      <div style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => setMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575', fontSize: 20 }}>←</button>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{editId ? 'Редактировать баннер' : 'Новый баннер'}</h1>
        </div>
        <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Заголовок" value={form.title} onChange={f('title')} required />
          <Input label="Подзаголовок" value={form.subtitle} onChange={f('subtitle')} />
          <Input label="Текст кнопки" value={form.buttonText} onChange={f('buttonText')} />
          <Input label="Ссылка кнопки" value={form.buttonLink} onChange={f('buttonLink')} />
          <Input label="URL изображения" value={form.image} onChange={f('image')} required />
          <Input label="Порядок сортировки" type="number" value={String(form.sortOrder)} onChange={(e) => setForm((p) => ({ ...p, sortOrder: +e.target.value }))} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            <span style={{ fontSize: 14 }}>Активен</span>
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="submit" variant="primary" loading={saving}>Сохранить</Button>
            <Button type="button" variant="outline" onClick={() => setMode('list')}>Отмена</Button>
          </div>
        </form>
      </div>
    </>
  )

  return (
    <>
      <Helmet><title>Баннеры — Döcke Admin</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Баннеры</h1>
          <p style={{ color: '#757575', fontSize: 14 }}>{banners.length} баннеров</p>
        </div>
        <Button variant="primary" onClick={startCreate}>+ Добавить баннер</Button>
      </div>

      {loading ? <p style={{ color: '#757575' }}>Загрузка...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {banners.map((b) => (
            <div key={b.id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 120, height: 68, background: '#f5f5f5', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                {b.image && <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#212121', marginBottom: 4 }}>{b.title}</p>
                {b.subtitle && <p style={{ color: '#757575', fontSize: 13 }}>{b.subtitle}</p>}
                <p style={{ color: '#9e9e9e', fontSize: 12, marginTop: 4 }}>Порядок: {b.sortOrder}</p>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: b.isActive ? '#e8f5e9' : '#f5f5f5', color: b.isActive ? '#2e7d32' : '#757575' }}>
                {b.isActive ? 'Активен' : 'Скрыт'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(b)} style={{ padding: '5px 12px', border: '1px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff' }}>Изменить</button>
                <button onClick={() => handleDelete(b.id)} style={{ padding: '5px 12px', border: '1px solid #ffcdd2', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#c62828' }}>Удалить</button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p style={{ textAlign: 'center', color: '#9e9e9e', padding: '40px 0' }}>Баннеров нет</p>}
        </div>
      )}
    </>
  )
}
