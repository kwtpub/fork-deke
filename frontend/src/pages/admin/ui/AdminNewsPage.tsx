import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'
import type { News } from '@entities/news'

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

type Mode = 'list' | 'edit'

const EMPTY_NEWS = { title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: true }

export const AdminNewsPage = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [form, setForm] = useState(EMPTY_NEWS)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadNews = () => {
    setLoading(true)
    apiInstance.get('/news?limit=100')
      .then((r) => setNews(r.data?.data ?? []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadNews, [])

  const startEdit = (item: News) => {
    setForm({ title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, coverImage: item.coverImage ?? '', isPublished: item.isPublished })
    setEditId(item.id)
    setMode('edit')
  }

  const startCreate = () => {
    setForm(EMPTY_NEWS)
    setEditId(null)
    setMode('edit')
  }

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await apiInstance.patch(`/news/${editId}`, form)
      } else {
        await apiInstance.post('/news', form)
      }
      loadNews()
      setMode('list')
    } catch {
      alert('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить новость?')) return
    await apiInstance.delete(`/news/${id}`)
    loadNews()
  }

  if (mode === 'edit') return (
    <>
      <Helmet><title>{editId ? 'Редактировать новость' : 'Новая новость'} — Admin</title></Helmet>
      <div style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => setMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575', fontSize: 20 }}>←</button>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{editId ? 'Редактировать новость' : 'Новая новость'}</h1>
        </div>
        <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          <Input label="Краткое описание" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#424242' }}>Контент (HTML)</label>
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              style={{ padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, resize: 'vertical', fontFamily: 'monospace' }}
            />
          </div>
          <Input label="URL изображения" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            <span style={{ fontSize: 14 }}>Опубликовано</span>
          </label>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button type="submit" variant="primary" loading={saving}>Сохранить</Button>
            <Button type="button" variant="outline" onClick={() => setMode('list')}>Отмена</Button>
          </div>
        </form>
      </div>
    </>
  )

  return (
    <>
      <Helmet><title>Новости — Döcke Admin</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121' }}>Новости</h1>
          <p style={{ color: '#757575', fontSize: 14 }}>{news.length} записей</p>
        </div>
        <Button variant="primary" onClick={startCreate}>+ Добавить новость</Button>
      </div>

      {loading ? <p style={{ color: '#757575' }}>Загрузка...</p> : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
                {['Заголовок', 'Slug', 'Дата', 'Статус', 'Действия'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#757575', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {news.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < news.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, maxWidth: 280 }}>{item.title}</td>
                  <td style={{ padding: '14px 16px', color: '#757575', fontSize: 12, fontFamily: 'monospace' }}>{item.slug}</td>
                  <td style={{ padding: '14px 16px', color: '#757575', fontSize: 13 }}>{formatDate(item.publishedAt)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: item.isPublished ? '#e8f5e9' : '#f5f5f5', color: item.isPublished ? '#2e7d32' : '#757575' }}>
                      {item.isPublished ? 'Опубл.' : 'Черновик'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(item)} style={{ padding: '5px 12px', border: '1px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff' }}>Изменить</button>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 12px', border: '1px solid #ffcdd2', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#c62828' }}>Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {news.length === 0 && <p style={{ textAlign: 'center', color: '#9e9e9e', padding: '40px 0' }}>Новостей нет</p>}
        </div>
      )}
    </>
  )
}
