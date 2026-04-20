import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import {
  Button,
  Card,
  FormField,
  PageHeader,
  useConfirm,
  useToast,
} from '@shared/ui/admin'
import { FileUpload } from '@shared/ui/FileUpload'
import type { Banner } from '@entities/banner'
import styles from './AdminBannersPage.module.scss'

type BannerRow = Banner

type BannerFormState = {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: string
  sortOrder: number
  isActive: boolean
}

const EMPTY_FORM: BannerFormState = {
  title: '',
  subtitle: '',
  buttonText: '',
  buttonLink: '',
  image: '',
  sortOrder: 0,
  isActive: true,
}

export const AdminBannersPage = () => {
  const toast = useToast()
  const confirm = useConfirm()

  const [banners, setBanners] = useState<BannerRow[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    apiInstance
      .get<{ data: BannerRow[] }>('/banners')
      .then((r) => setBanners(r.data?.data ?? []))
      .catch(() => {
        setBanners([])
        toast.error('Не удалось загрузить баннеры')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setModalOpen(true)
  }

  const openEdit = (b: BannerRow) => {
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? '',
      buttonText: b.buttonText ?? '',
      buttonLink: b.buttonLink ?? '',
      image: b.image,
      sortOrder: b.sortOrder ?? 0,
      isActive: b.isActive,
    })
    setEditId(b.id)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const updateField = <K extends keyof BannerFormState>(
    field: K,
    value: BannerFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Введите заголовок')
      return
    }
    if (!form.image.trim()) {
      toast.error('Загрузите изображение')
      return
    }
    setSaving(true)
    try {
      if (editId) {
        await apiInstance.patch(`/banners/${editId}`, form)
        toast.success('Баннер обновлён')
      } else {
        await apiInstance.post('/banners', form)
        toast.success('Баннер создан')
      }
      setModalOpen(false)
      setEditId(null)
      setForm(EMPTY_FORM)
      load()
    } catch {
      toast.error('Не удалось сохранить баннер')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row: BannerRow) => {
    const ok = await confirm({
      destructive: true,
      title: 'Удалить баннер?',
      message: `«${row.title}». Действие необратимо.`,
      confirmText: 'Удалить',
    })
    if (!ok) return
    try {
      await apiInstance.delete(`/banners/${row.id}`)
      toast.success('Баннер удалён')
      load()
    } catch {
      toast.error('Не удалось удалить баннер')
    }
  }

  const toggleActive = async (row: BannerRow) => {
    try {
      await apiInstance.patch(`/banners/${row.id}`, { isActive: !row.isActive })
      setBanners((prev) =>
        prev.map((b) => (b.id === row.id ? { ...b, isActive: !row.isActive } : b)),
      )
      toast.success(!row.isActive ? 'Баннер активирован' : 'Баннер скрыт')
    } catch {
      toast.error('Не удалось обновить статус')
    }
  }

  return (
    <>
      <Helmet>
        <title>Баннеры — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Баннеры"
        subtitle={`Главная страница · ${banners.length} ${pluralize(banners.length, ['баннер', 'баннера', 'баннеров'])}`}
        action={
          <Button variant="primary" onClick={openCreate}>
            + Добавить баннер
          </Button>
        }
      />

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={`skel-${i}`} className={styles.card} padded={false}>
              <div className={styles.preview}>
                <div className={styles.previewPlaceholder}>Загрузка…</div>
              </div>
              <div className={styles.body}>
                <p className={styles.title}>&nbsp;</p>
                <p className={styles.subtitle}>&nbsp;</p>
              </div>
            </Card>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--foreground-muted, #788584)' }}>
            Баннеров пока нет. Создайте первый, чтобы он появился на главной.
          </p>
        </Card>
      ) : (
        <div className={styles.grid}>
          {banners.map((b) => (
            <Card key={b.id} className={styles.card} padded={false}>
              <div className={styles.preview}>
                {b.image ? (
                  <img
                    className={styles.previewImage}
                    src={b.image}
                    alt={b.title}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>Нет изображения</div>
                )}
                <span
                  className={`${styles.statusChip} ${b.isActive ? styles.statusChipActive : ''}`}
                >
                  <span className={styles.statusChipDot} />
                  {b.isActive ? 'Активен' : 'Скрыт'}
                </span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.title}>{b.title}</h3>
                {b.subtitle && <p className={styles.subtitle}>{b.subtitle}</p>}
                {b.buttonText && (
                  <p className={styles.subtitle}>
                    <span style={{ color: 'var(--foreground-muted, #788584)' }}>Кнопка: </span>
                    {b.buttonText}
                  </p>
                )}
                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <span>Ссылка</span>
                    <span className={styles.metaValue} title={b.buttonLink ?? ''}>
                      {b.buttonLink || '—'}
                    </span>
                  </div>
                  <div className={styles.metaRow}>
                    <span>Порядок</span>
                    <span className={styles.metaValue}>{b.sortOrder}</span>
                  </div>
                </div>
              </div>

              <div className={styles.toggleRow}>
                <span>Показывать на сайте</span>
                <button
                  type="button"
                  className={`${styles.toggle} ${b.isActive ? styles.toggleOn : ''}`}
                  aria-pressed={b.isActive}
                  aria-label={b.isActive ? 'Скрыть баннер' : 'Показать баннер'}
                  onClick={() => {
                    void toggleActive(b)
                  }}
                />
              </div>

              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  size="sm"
                  className={styles.actionBtn}
                  onClick={() => openEdit(b)}
                >
                  Редактировать
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className={styles.actionBtn}
                  onClick={() => {
                    void handleDelete(b)
                  }}
                >
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editId ? 'Редактировать баннер' : 'Новый баннер'}
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Закрыть"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <FormField label="Заголовок" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Подзаголовок">
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                />
              </FormField>

              <FormField label="Текст кнопки">
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                />
              </FormField>

              <FormField label="Ссылка кнопки">
                <input
                  type="text"
                  value={form.buttonLink}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                  placeholder="/catalog или https://..."
                />
              </FormField>

              <FormField label="Порядок сортировки" hint="Меньше — выше в слайдере">
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    updateField('sortOrder', Number(e.target.value) || 0)
                  }
                />
              </FormField>

              <FormField
                label="Изображение"
                required
                hint="Рекомендованное соотношение 16:9. JPG, PNG или WebP."
              >
                <FileUpload
                  folder="banners"
                  multiple={false}
                  onUpload={(urls) => updateField('image', urls[0] ?? '')}
                />
              </FormField>

              {form.image && (
                <div className={styles.uploadedPreview}>
                  <img src={form.image} alt="Превью" />
                  <span className={styles.uploadedPreviewText}>{form.image}</span>
                </div>
              )}

              <label className={styles.toggleField}>
                <span>Показывать на сайте</span>
                <button
                  type="button"
                  className={`${styles.toggle} ${form.isActive ? styles.toggleOn : ''}`}
                  aria-pressed={form.isActive}
                  onClick={() => updateField('isActive', !form.isActive)}
                />
              </label>

              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
                  Отмена
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                  {editId ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
