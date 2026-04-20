import { type ChangeEvent } from 'react'
import { Button, Card, FormField } from '@shared/ui/admin'
import { FileUpload } from '@shared/ui/FileUpload'
import styles from './AdminNewsFormPage.module.scss'

export interface NewsFormState {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  isPublished: boolean
  publishedAt: string
}

export type NewsFormErrors = Partial<Record<keyof NewsFormState, string>>

interface NewsFormViewProps {
  form: NewsFormState
  errors: NewsFormErrors
  saving: boolean
  submitLabel: string
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFieldChange: (
    field: keyof NewsFormState,
  ) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onCoverUpload: (urls: string[]) => void
  onCoverRemove: () => void
  onToggleStatus: () => void
  onSubmit: () => void
  onCancel: () => void
}

export const NewsFormView = ({
  form,
  errors,
  saving,
  submitLabel,
  onTitleChange,
  onFieldChange,
  onCoverUpload,
  onCoverRemove,
  onToggleStatus,
  onSubmit,
  onCancel,
}: NewsFormViewProps) => (
  <div className={styles.layout}>
    <Card className={styles.card}>
      <h2 className={styles.sectionTitle}>Основное</h2>

      <FormField label="Заголовок" htmlFor="news-title" required error={errors.title}>
        <input
          id="news-title"
          type="text"
          value={form.title}
          onChange={onTitleChange}
          placeholder="Заголовок новости"
        />
      </FormField>

      <FormField
        label="Slug"
        htmlFor="news-slug"
        required
        error={errors.slug}
        hint="Автозаполняется из заголовка. Используется в URL."
      >
        <input
          id="news-slug"
          type="text"
          value={form.slug}
          onChange={onFieldChange('slug')}
          placeholder="news-slug"
        />
      </FormField>

      <FormField
        label="Краткое описание"
        htmlFor="news-excerpt"
        required
        error={errors.excerpt}
      >
        <textarea
          id="news-excerpt"
          value={form.excerpt}
          onChange={onFieldChange('excerpt')}
          rows={3}
          placeholder="Короткий анонс"
        />
      </FormField>

      <FormField
        label="Содержимое"
        htmlFor="news-content"
        required
        error={errors.content}
        hint="Поддерживается HTML-разметка."
      >
        <textarea
          id="news-content"
          value={form.content}
          onChange={onFieldChange('content')}
          className={styles.contentArea}
          rows={16}
          placeholder="Полный текст новости"
        />
      </FormField>

      <div className={styles.actions}>
        <Button variant="primary" onClick={onSubmit} loading={saving}>
          {submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </Card>

    <Card className={styles.card}>
      <h2 className={styles.sectionTitle}>Публикация</h2>

      <FormField label="Обложка">
        <div className={styles.coverBlock}>
          {form.coverImage ? (
            <div className={styles.coverPreview}>
              <img src={form.coverImage} alt="Предпросмотр обложки" />
              <button type="button" className={styles.coverRemove} onClick={onCoverRemove}>
                Удалить
              </button>
            </div>
          ) : null}
          <FileUpload folder="news" multiple={false} onUpload={onCoverUpload} />
        </div>
      </FormField>

      <FormField label="Статус">
        <div className={styles.toggleRow}>
          <div className={styles.toggleLabel}>
            <span>{form.isPublished ? 'Опубликовано' : 'Черновик'}</span>
            <span>
              {form.isPublished
                ? 'Новость видна посетителям сайта'
                : 'Новость скрыта и видна только в админке'}
            </span>
          </div>
          <button
            type="button"
            className={`${styles.switch} ${form.isPublished ? styles.switchActive : ''}`}
            onClick={onToggleStatus}
            aria-label="Переключить статус публикации"
            aria-pressed={form.isPublished}
          />
        </div>
      </FormField>

      <FormField label="Дата публикации" htmlFor="news-published-at">
        <input
          id="news-published-at"
          type="date"
          value={form.publishedAt}
          onChange={onFieldChange('publishedAt')}
        />
      </FormField>
    </Card>
  </div>
)
