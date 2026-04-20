import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import styles from './DocsPage.module.scss'

interface ApiDocument {
  id: string
  name: string
  fileUrl: string
  thumbnailUrl?: string
  type: string
  category?: string
  createdAt?: string
  updatedAt?: string
  isPublished?: boolean
}

type DocCategory = 'certificate' | 'license' | 'passport' | 'declaration'

interface DocItem {
  id: string
  title: string
  category: DocCategory
  badgeLabel: string
  date: string
  iconKey: IconKey
  fileUrl: string
}

type IconKey = 'file-badge' | 'shield-check' | 'file-text' | 'flame' | 'file-check'

const CATEGORY_LABEL: Record<DocCategory, string> = {
  certificate: 'СЕРТИФИКАТ',
  license: 'ЛИЦЕНЗИЯ',
  passport: 'ПАСПОРТ КАЧЕСТВА',
  declaration: 'ДЕКЛАРАЦИЯ',
}

const FILTERS: Array<{ key: 'all' | DocCategory; label: string }> = [
  { key: 'all', label: 'Все' },
  { key: 'certificate', label: 'Сертификаты' },
  { key: 'license', label: 'Лицензии' },
  { key: 'passport', label: 'Паспорта качества' },
]

const formatDate = (iso?: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

const mapCategory = (raw?: string): DocCategory => {
  const v = (raw ?? '').toLowerCase()
  if (v.includes('licen') || v.includes('лиценз')) return 'license'
  if (v.includes('declar') || v.includes('деклар')) return 'declaration'
  if (v.includes('passport') || v.includes('паспорт') || v.includes('technical')) return 'passport'
  return 'certificate'
}

const iconForCategory = (cat: DocCategory, title: string): IconKey => {
  const t = title.toLowerCase()
  if (t.includes('пожар') || t.includes('fire')) return 'flame'
  if (cat === 'license') return 'shield-check'
  if (cat === 'declaration') return 'file-check'
  if (cat === 'passport') return 'file-text'
  return 'file-badge'
}

const FALLBACK_DOCS: DocItem[] = [
  {
    id: 'f1',
    title: 'Сертификат ISO 9001',
    category: 'certificate',
    badgeLabel: CATEGORY_LABEL.certificate,
    date: '27.07.2024',
    iconKey: 'file-badge',
    fileUrl: '#',
  },
  {
    id: 'f2',
    title: 'Лицензия на строительную деятельность',
    category: 'license',
    badgeLabel: CATEGORY_LABEL.license,
    date: '05.01.2024',
    iconKey: 'shield-check',
    fileUrl: '#',
  },
  {
    id: 'f3',
    title: 'Паспорт качества цемента М500',
    category: 'passport',
    badgeLabel: CATEGORY_LABEL.passport,
    date: '15.03.2024',
    iconKey: 'file-text',
    fileUrl: '#',
  },
  {
    id: 'f4',
    title: 'Сертификат пожарной безопасности',
    category: 'certificate',
    badgeLabel: CATEGORY_LABEL.certificate,
    date: '12.11.2023',
    iconKey: 'flame',
    fileUrl: '#',
  },
  {
    id: 'f5',
    title: 'Декларация соответствия кирпич',
    category: 'declaration',
    badgeLabel: CATEGORY_LABEL.declaration,
    date: '08.06.2024',
    iconKey: 'file-check',
    fileUrl: '#',
  },
  {
    id: 'f6',
    title: 'Паспорт качества арматура А500',
    category: 'passport',
    badgeLabel: CATEGORY_LABEL.passport,
    date: '22.09.2023',
    iconKey: 'file-text',
    fileUrl: '#',
  },
]

const DocIcon = ({ name }: { name: IconKey }) => {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'file-badge':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <circle cx="9" cy="15" r="2.5" />
          <path d="M7.5 17 6.5 22l2.5-1.5L11.5 22l-1-5" />
        </svg>
      )
    case 'shield-check':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      )
    case 'file-text':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
          <line x1="8" y1="9" x2="10" y2="9" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 3-1.2 3-3 0-2-1-4-3-5 .5 2.5-2 3-2 4.5zM12 2s4 4 4 8c0 2-1 4-1 4s-2-1-3-3c0 2-2 3-2 3s-3-2-3-5 5-7 5-7z" />
        </svg>
      )
    case 'file-check':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <polyline points="9 15 11 17 15 13" />
        </svg>
      )
  }
}

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const DocsPage = () => {
  const [docs, setDocs] = useState<DocItem[]>([])
  const [activeTab, setActiveTab] = useState<'all' | DocCategory>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    apiInstance
      .get<{ data: ApiDocument[] }>('/documents')
      .then((r) => {
        if (cancelled) return
        const raw = r.data?.data ?? []
        if (!raw.length) {
          setDocs(FALLBACK_DOCS)
          return
        }
        const mapped: DocItem[] = raw.map((d) => {
          const cat = mapCategory(d.category ?? d.type)
          return {
            id: d.id,
            title: d.name,
            category: cat,
            badgeLabel: CATEGORY_LABEL[cat],
            date: formatDate(d.createdAt ?? d.updatedAt),
            iconKey: iconForCategory(cat, d.name),
            fileUrl: d.fileUrl || '#',
          }
        })
        setDocs(mapped)
      })
      .catch(() => {
        if (!cancelled) setDocs(FALLBACK_DOCS)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () => (activeTab === 'all' ? docs : docs.filter((d) => d.category === activeTab)),
    [docs, activeTab],
  )

  return (
    <>
      <Helmet>
        <title>Документы и сертификаты — Нексу</title>
        <meta
          name="description"
          content="Прозрачность и подтверждённое качество — полный пакет документации на материалы Нексу."
        />
      </Helmet>

      <div className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Документы и сертификаты</h1>
          <p className={styles.subtitle}>
            Прозрачность и подтверждённое качество — мы предоставляем полный пакет документации на все материалы.
          </p>
        </section>

        <div className={styles.filters} role="tablist" aria-label="Фильтр документов">
          {FILTERS.map((f) => {
            const isActive = activeTab === f.key
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filter} ${isActive ? styles.filterActive : ''}`}
                onClick={() => setActiveTab(f.key)}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div className={styles.grid}>
          {loading ? (
            <p className={styles.state}>Загрузка...</p>
          ) : filtered.length === 0 ? (
            <p className={styles.state}>Документы не найдены</p>
          ) : (
            filtered.map((doc) => (
              <article key={doc.id} className={styles.card}>
                <span className={styles.badge}>{doc.badgeLabel}</span>
                <div className={styles.icon} aria-hidden>
                  <DocIcon name={doc.iconKey} />
                </div>
                <h2 className={styles.cardTitle}>{doc.title}</h2>
                {doc.date && <p className={styles.cardDate}>{doc.date}</p>}
                <a
                  className={styles.downloadBtn}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <DownloadIcon />
                  Скачать PDF
                </a>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  )
}
