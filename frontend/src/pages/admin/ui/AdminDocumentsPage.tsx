import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'

interface Document {
  id: string
  name: string
  fileUrl: string
  type: 'certificate' | 'instruction' | 'technical'
  isPublished: boolean
}

const TYPE_LABELS = { certificate: 'Сертификат', instruction: 'Инструкция', technical: 'Техпаспорт' }
type Mode = 'list' | 'edit'
const EMPTY = { name: '', fileUrl: '', type: 'instruction' as Document['type'], isPublished: true }

export const AdminDocumentsPage = () => {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    apiInstance.get('/documents')
      .then((r) => setDocs(r.data?.data ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startEdit = (d: Document) => {
    setForm({ name: d.name, fileUrl: d.fileUrl, type: d.type, isPublished: d.isPublished })
    setEditId(d.id); setMode('edit')
  }

  const startCreate = () => { setForm(EMPTY); setEditId(null); setMode('edit') }

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) await apiInstance.patch(`/documents/${editId}`, form)
      else await apiInstance.post('/documents', form)
      load(); setMode('list')
    } catch { alert('Ошибка') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить документ?')) return
    await apiInstance.delete(`/documents/${id}`)
    load()
  }

  if (mode === 'edit') return (
    <>
      <Helmet><title>{editId ? 'Редактировать документ' : 'Новый документ'} — Admin</title></Helmet>
      <div style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => setMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575', fontSize: 20 }}>←</button>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{editId ? 'Редактировать документ' : 'Новый документ'}</h1>
        </div>
        <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Название" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="URL файла (PDF)" value={form.fileUrl} onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#424242' }}>Тип документа</label>
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Document['type'] }))}
              style={{ padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
              {Object.entries(TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
            <span style={{ fontSize: 14 }}>Опубликован</span>
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
      <Helmet><title>Документы — Нексу Admin</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Документы</h1>
          <p style={{ color: '#757575', fontSize: 14 }}>{docs.length} файлов</p>
        </div>
        <Button variant="primary" onClick={startCreate}>+ Добавить документ</Button>
      </div>

      {loading ? <p style={{ color: '#757575' }}>Загрузка...</p> : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
                {['Название', 'Тип', 'Статус', 'Действия'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#757575', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: i < docs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: '#212121' }}>
                    <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      📄 {d.name}
                    </a>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#616161', fontSize: 13 }}>{TYPE_LABELS[d.type] ?? d.type}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: d.isPublished ? '#e8f5e9' : '#f5f5f5', color: d.isPublished ? '#2e7d32' : '#757575' }}>
                      {d.isPublished ? 'Опубл.' : 'Скрыт'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(d)} style={{ padding: '5px 12px', border: '1px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff' }}>Изменить</button>
                      <button onClick={() => handleDelete(d.id)} style={{ padding: '5px 12px', border: '1px solid #ffcdd2', borderRadius: 6, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#c62828' }}>Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {docs.length === 0 && <p style={{ textAlign: 'center', color: '#9e9e9e', padding: '40px 0' }}>Документов нет</p>}
        </div>
      )}
    </>
  )
}
