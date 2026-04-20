import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import {
  Button,
  Card,
  DataTable,
  FormField,
  PageHeader,
  useConfirm,
  useToast,
} from '@shared/ui/admin'
import type { Column } from '@shared/ui/admin'
import { FileUpload } from '@shared/ui/FileUpload'
import styles from './AdminDocumentsPage.module.scss'

type DocType = 'certificate' | 'instruction' | 'technical'
type FilterValue = 'all' | DocType

type DocumentRow = {
  id: string
  name: string
  fileUrl: string
  type: DocType
  isPublished: boolean
}

type DocumentFormState = {
  name: string
  type: DocType
  fileUrl: string
  isPublished: boolean
}

const TYPE_LABELS: Record<DocType, string> = {
  certificate: 'Сертификаты',
  instruction: 'Инструкции',
  technical: 'Техпаспорта',
}

const TYPE_BADGE_LABEL: Record<DocType, string> = {
  certificate: 'Сертификат',
  instruction: 'Инструкция',
  technical: 'Техпаспорт',
}

const TYPE_BADGE_CLASS: Record<DocType, string> = {
  certificate: styles.typeCertificate,
  instruction: styles.typeInstruction,
  technical: styles.typeTechnical,
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'certificate', label: TYPE_LABELS.certificate },
  { value: 'instruction', label: TYPE_LABELS.instruction },
  { value: 'technical', label: TYPE_LABELS.technical },
]

const EMPTY_FORM: DocumentFormState = {
  name: '',
  type: 'instruction',
  fileUrl: '',
  isPublished: true,
}

const PdfIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="14 2 14 8 20 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fill="currentColor"
      fontFamily="Inter, Arial, sans-serif"
      fontSize="6"
      fontWeight="800"
    >
      PDF
    </text>
  </svg>
)

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const DeleteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export const AdminDocumentsPage = () => {
  const toast = useToast()
  const confirm = useConfirm()

  const [docs, setDocs] = useState<DocumentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterValue>('all')

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<DocumentFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    apiInstance
      .get<{ data: DocumentRow[] }>('/documents')
      .then((r) => setDocs(r.data?.data ?? []))
      .catch(() => {
        setDocs([])
        toast.error('Не удалось загрузить документы')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const resetCreate = () => {
    setForm(EMPTY_FORM)
    setShowCreate(false)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Введите название')
      return
    }
    if (!form.fileUrl.trim()) {
      toast.error('Загрузите PDF-файл')
      return
    }
    setSaving(true)
    try {
      await apiInstance.post('/documents', form)
      toast.success('Документ создан')
      resetCreate()
      load()
    } catch {
      toast.error('Не удалось сохранить документ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row: DocumentRow) => {
    const ok = await confirm({
      destructive: true,
      title: 'Удалить документ?',
      message: `«${row.name}». Действие необратимо.`,
      confirmText: 'Удалить',
    })
    if (!ok) return
    try {
      await apiInstance.delete(`/documents/${row.id}`)
      toast.success('Документ удалён')
      load()
    } catch {
      toast.error('Не удалось удалить документ')
    }
  }

  const togglePublished = async (row: DocumentRow) => {
    try {
      await apiInstance.patch(`/documents/${row.id}`, {
        isPublished: !row.isPublished,
      })
      setDocs((prev) =>
        prev.map((d) =>
          d.id === row.id ? { ...d, isPublished: !row.isPublished } : d,
        ),
      )
      toast.success(!row.isPublished ? 'Документ опубликован' : 'Документ скрыт')
    } catch {
      toast.error('Не удалось обновить статус')
    }
  }

  const filtered = useMemo(
    () => (filter === 'all' ? docs : docs.filter((d) => d.type === filter)),
    [docs, filter],
  )

  const columns: Column<DocumentRow>[] = [
    {
      key: 'icon',
      label: '',
      width: '56px',
      render: () => (
        <span className={styles.pdfIcon}>
          <PdfIcon />
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Название',
      render: (row) => (
        <a
          className={`${styles.nameCell} ${styles.nameLink}`}
          href={row.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </a>
      ),
    },
    {
      key: 'type',
      label: 'Тип',
      width: '150px',
      render: (row) => (
        <span className={`${styles.typeBadge} ${TYPE_BADGE_CLASS[row.type]}`}>
          {TYPE_BADGE_LABEL[row.type]}
        </span>
      ),
    },
    {
      key: 'isPublished',
      label: 'Опубликован',
      width: '130px',
      render: (row) => (
        <button
          type="button"
          className={`${styles.toggle} ${row.isPublished ? styles.toggleOn : ''}`}
          aria-pressed={row.isPublished}
          aria-label={row.isPublished ? 'Скрыть' : 'Опубликовать'}
          onClick={(e) => {
            e.stopPropagation()
            void togglePublished(row)
          }}
        />
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      width: '110px',
      render: (row) => (
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <a
            className={styles.iconBtn}
            href={row.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Скачать"
            download
          >
            <DownloadIcon />
          </a>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            title="Удалить"
            onClick={() => {
              void handleDelete(row)
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Helmet>
        <title>Документы — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Документы"
        subtitle={`PDF-файлы · ${docs.length} ${pluralize(docs.length, ['документ', 'документа', 'документов'])}`}
        action={
          !showCreate ? (
            <Button variant="primary" onClick={() => setShowCreate(true)}>
              + Добавить документ
            </Button>
          ) : null
        }
      />

      {showCreate && (
        <Card className={styles.createCard}>
          <div className={styles.createHeader}>
            <h2 className={styles.createTitle}>Новый документ</h2>
            <Button variant="ghost" size="sm" onClick={resetCreate} disabled={saving}>
              Отмена
            </Button>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <FormField label="Название" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Сертификат соответствия..."
                required
              />
            </FormField>

            <FormField label="Тип документа" required>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value as DocType }))
                }
              >
                <option value="certificate">Сертификат</option>
                <option value="instruction">Инструкция</option>
                <option value="technical">Техпаспорт</option>
              </select>
            </FormField>

            <FormField
              label="PDF-файл"
              required
              className={styles.formFull}
              hint="Только PDF-файлы"
            >
              <FileUpload
                folder="docs"
                multiple={false}
                accept="application/pdf"
                onUpload={(urls) =>
                  setForm((p) => ({ ...p, fileUrl: urls[0] ?? '' }))
                }
              />
            </FormField>

            {form.fileUrl && (
              <div className={`${styles.uploadedPreview} ${styles.formFull}`}>
                <span>Загружено:</span>
                <a href={form.fileUrl} target="_blank" rel="noopener noreferrer">
                  {form.fileUrl}
                </a>
              </div>
            )}

            <label className={styles.toggleField}>
              <span>Опубликован</span>
              <button
                type="button"
                className={`${styles.toggle} ${form.isPublished ? styles.toggleOn : ''}`}
                aria-pressed={form.isPublished}
                onClick={() =>
                  setForm((p) => ({ ...p, isPublished: !p.isPublished }))
                }
              />
            </label>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={resetCreate}
                disabled={saving}
              >
                Отмена
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Создать
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              className={`${styles.pill} ${active ? styles.pillActive : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <DataTable<DocumentRow>
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText={
          filter === 'all' ? 'Документов пока нет' : 'В этой категории пусто'
        }
        getRowKey={(row) => row.id}
      />
    </>
  )
}

const pluralize = (n: number, forms: [string, string, string]): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}
