import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { apiInstance } from '@shared/api/baseApi'

interface Document {
  id: string
  name: string
  fileUrl: string
  thumbnailUrl?: string
  type: 'certificate' | 'instruction' | 'technical'
  isPublished: boolean
}

const TYPE_LABELS: Record<string, string> = {
  certificate: 'Сертификаты',
  instruction: 'Инструкции',
  technical: 'Технические паспорта',
}

const TYPE_ICONS: Record<string, string> = {
  certificate: '🏅',
  instruction: '📋',
  technical: '📐',
}

export const DocsPage = () => {
  const [docs, setDocs] = useState<Document[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiInstance.get<{ data: Document[] }>('/documents')
      .then((r) => setDocs(r.data.data ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false))
  }, [])

  const types = ['all', ...Array.from(new Set(docs.map((d) => d.type)))]
  const filtered = activeTab === 'all' ? docs : docs.filter((d) => d.type === activeTab)

  return (
    <>
      <Helmet>
        <title>Документы — Döcke</title>
        <meta name="description" content="Сертификаты, инструкции по монтажу и технические паспорта продукции Döcke." />
      </Helmet>

      <section style={{ background: 'var(--color-primary)', color: '#fff', padding: '60px 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Документы' }]} />
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: '24px 0 12px' }}>Документы</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>Сертификаты соответствия, инструкции и технические паспорта</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                style={{
                  padding: '8px 20px', border: '1px solid',
                  borderColor: activeTab === type ? 'var(--color-primary)' : '#e0e0e0',
                  background: activeTab === type ? 'var(--color-primary)' : '#fff',
                  color: activeTab === type ? '#fff' : '#424242',
                  borderRadius: 20, cursor: 'pointer', fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                {type === 'all' ? 'Все документы' : TYPE_LABELS[type] ?? type}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: '#757575', textAlign: 'center', padding: '60px 0' }}>Загрузка...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#757575', textAlign: 'center', padding: '60px 0' }}>Документы не найдены</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {filtered.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', gap: 16, alignItems: 'center',
                    background: '#fff', border: '1px solid #e0e0e0',
                    borderRadius: 12, padding: 20, textDecoration: 'none',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = '#e0e0e0'
                  }}
                >
                  <div style={{
                    width: 48, height: 48, background: '#fff3e0',
                    borderRadius: 10, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 22, flexShrink: 0,
                  }}>
                    {TYPE_ICONS[doc.type] ?? '📄'}
                  </div>
                  <div>
                    <p style={{ color: '#212121', fontWeight: 600, marginBottom: 4, fontSize: 14, lineHeight: 1.4 }}>
                      {doc.name}
                    </p>
                    <p style={{ color: '#9e9e9e', fontSize: 12 }}>
                      {TYPE_LABELS[doc.type] ?? doc.type} · PDF
                    </p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#bdbdbd', fontSize: 18 }}>↓</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
