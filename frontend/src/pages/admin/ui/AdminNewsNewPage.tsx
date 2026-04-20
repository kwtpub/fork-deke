import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { PageHeader, useToast } from '@shared/ui/admin'
import { PATHS } from '@app/routes/paths'
import { NewsFormView, type NewsFormErrors, type NewsFormState } from './NewsFormView'
import styles from './AdminNewsFormPage.module.scss'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY_FORM: NewsFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  isPublished: true,
  publishedAt: today(),
}

export const AdminNewsNewPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState<NewsFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<NewsFormErrors>({})
  const [saving, setSaving] = useState(false)
  const [slugDirty, setSlugDirty] = useState(false)

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugDirty ? prev.slug : toSlug(title),
    }))
  }

  const handleFieldChange =
    (field: keyof NewsFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === 'slug') setSlugDirty(true)
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
      await apiInstance.post('/news', payload)
      toast.success('Новость создана')
      navigate(PATHS.ADMIN_NEWS)
    } catch (error) {
      const err = error as { response?: { data?: { message?: string | string[] } } }
      const message = err?.response?.data?.message
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Ошибка при создании'
      toast.error(text)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Новая новость — Нексу Admin</title>
      </Helmet>

      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate(PATHS.ADMIN_NEWS)}
      >
        ← Назад к списку
      </button>

      <PageHeader title="Новая новость" subtitle="Заполните поля и опубликуйте материал" />

      <NewsFormView
        form={form}
        errors={errors}
        saving={saving}
        submitLabel="Создать"
        onTitleChange={handleTitleChange}
        onFieldChange={handleFieldChange}
        onCoverUpload={handleCoverUpload}
        onCoverRemove={handleCoverRemove}
        onToggleStatus={handleToggleStatus}
        onSubmit={handleSubmit}
        onCancel={() => navigate(PATHS.ADMIN_NEWS)}
      />
    </>
  )
}
