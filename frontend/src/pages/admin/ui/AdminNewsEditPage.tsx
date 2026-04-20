import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { PageHeader, useToast } from '@shared/ui/admin'
import type { News } from '@entities/news'
import { PATHS } from '@app/routes/paths'
import { NewsFormView, type NewsFormErrors, type NewsFormState } from './NewsFormView'
import styles from './AdminNewsFormPage.module.scss'

const EMPTY_FORM: NewsFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  isPublished: false,
  publishedAt: '',
}

const toInputDate = (value?: string) => (value ? value.slice(0, 10) : '')

export const AdminNewsEditPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState<NewsFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<NewsFormErrors>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadNews = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await apiInstance.get<{ data: News }>(`/news/${id}`)
      const item = response.data?.data
      if (!item) {
        toast.error('Новость не найдена')
        navigate(PATHS.ADMIN_NEWS)
        return
      }
      setForm({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage ?? '',
        isPublished: item.isPublished,
        publishedAt: toInputDate(item.publishedAt ?? item.createdAt),
      })
    } catch {
      toast.error('Не удалось загрузить новость')
      navigate(PATHS.ADMIN_NEWS)
    } finally {
      setLoading(false)
    }
  }, [id, navigate, toast])

  useEffect(() => {
    void loadNews()
  }, [loadNews])

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, title: event.target.value }))
  }

  const handleFieldChange =
    (field: keyof NewsFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleCoverUpload = (urls: string[]) => {
    setForm((prev) => ({ ...prev, coverImage: urls[0] ?? prev.coverImage }))
  }

  const handleCoverRemove = () => {
    setForm((prev) => ({ ...prev, coverImage: '' }))
  }

  const handleToggleStatus = () => {
    setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))
  }

  const validate = () => {
    const nextErrors: NewsFormErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Укажите заголовок'
    if (!form.slug.trim()) nextErrors.slug = 'Укажите slug'
    if (!form.excerpt.trim()) nextErrors.excerpt = 'Укажите краткое описание'
    if (!form.content.trim()) nextErrors.content = 'Добавьте содержимое'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!id) return
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        coverImage: form.coverImage.trim() || null,
        isPublished: form.isPublished,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      }
      await apiInstance.patch(`/news/${id}`, payload)
      toast.success('Новость обновлена')
      navigate(PATHS.ADMIN_NEWS)
    } catch (error) {
      const err = error as { response?: { data?: { message?: string | string[] } } }
      const message = err?.response?.data?.message
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Ошибка при сохранении'
      toast.error(text)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Редактирование новости — Нексу Admin</title>
      </Helmet>

      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate(PATHS.ADMIN_NEWS)}
      >
        ← Назад к списку
      </button>

      <PageHeader title="Редактирование новости" subtitle={form.slug || '—'} />

      {loading ? (
        <p className={styles.loadingNote}>Загрузка…</p>
      ) : (
        <NewsFormView
          form={form}
          errors={errors}
          saving={saving}
          submitLabel="Сохранить"
          onTitleChange={handleTitleChange}
          onFieldChange={handleFieldChange}
          onCoverUpload={handleCoverUpload}
          onCoverRemove={handleCoverRemove}
          onToggleStatus={handleToggleStatus}
          onSubmit={handleSubmit}
          onCancel={() => navigate(PATHS.ADMIN_NEWS)}
        />
      )}
    </>
  )
}
