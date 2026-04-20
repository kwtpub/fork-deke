import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiInstance } from '@shared/api/baseApi'
import { Button, Card, FormField, useToast } from '@shared/ui/admin'
import { FileUpload } from '@shared/ui/FileUpload'
import type { AdminProductPayload } from '@entities/product/api/productApi'
import { productApi } from '@entities/product'
import { PATHS } from '@app/routes/paths'
import styles from './AdminProductForm.module.scss'

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

interface FlatCategory {
  id: string
  name: string
  depth: number
}

const flatten = (list: Category[], depth = 0): FlatCategory[] =>
  list.flatMap((c) => [
    { id: c.id, name: c.name, depth },
    ...flatten(c.children ?? [], depth + 1),
  ])

const autoSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export interface ProductFormInitial {
  name: string
  slug: string
  description: string
  priceFrom: string
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  images: string[]
  specifications: Array<{ key: string; value: string }>
}

export const EMPTY_PRODUCT_FORM: ProductFormInitial = {
  name: '',
  slug: '',
  description: '',
  priceFrom: '',
  categoryId: '',
  isActive: true,
  isFeatured: false,
  images: [],
  specifications: [],
}

interface AdminProductFormProps {
  mode: 'create' | 'edit'
  initial: ProductFormInitial
  productId?: string
}

type FormErrors = Partial<Record<'name' | 'slug' | 'categoryId', string>>

export const AdminProductForm = ({ mode, initial, productId }: AdminProductFormProps) => {
  const navigate = useNavigate()
  const toast = useToast()

  const [categories, setCategories] = useState<FlatCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ProductFormInitial>(initial)
  const [slugManual, setSlugManual] = useState(mode === 'edit')
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setForm(initial)
  }, [initial])

  useEffect(() => {
    apiInstance
      .get<{ data: Category[] }>('/categories')
      .then((r) => setCategories(flatten(r.data?.data ?? [])))
      .catch(() => setCategories([]))
  }, [])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: slugManual ? prev.slug : autoSlug(name) }))
  }

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlugManual(true)
    setForm((prev) => ({ ...prev, slug: e.target.value }))
  }

  const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, description: e.target.value }))
  }

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, priceFrom: e.target.value }))
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, categoryId: e.target.value }))
  }

  const toggleBool = (key: 'isActive' | 'isFeatured') => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }))
  }

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((s, i) =>
        i === index ? { ...s, [field]: value } : s,
      ),
    }))
  }

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const handleImagesUploaded = (urls: string[]) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
  }

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((u) => u !== url) }))
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Укажите название товара'
    if (!form.slug.trim()) e.slug = 'Укажите slug'
    if (!form.categoryId) e.categoryId = 'Выберите категорию'
    return e
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const specsObject = form.specifications.reduce<Record<string, string>>((acc, item) => {
      const key = item.key.trim()
      if (key) acc[key] = item.value
      return acc
    }, {})

    const payload: AdminProductPayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      priceFrom: form.priceFrom ? parseFloat(form.priceFrom) : null,
      categoryId: form.categoryId,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      images: form.images,
      specifications: specsObject,
    }

    setLoading(true)
    try {
      if (mode === 'create') {
        await productApi.createAdmin(payload)
        toast.success('Товар создан')
      } else if (productId) {
        await productApi.updateAdmin(productId, payload)
        toast.success('Товар обновлён')
      }
      navigate(PATHS.ADMIN_PRODUCTS)
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.column}>
          <Card>
            <h2 className={styles.cardTitle}>Основная информация</h2>
            <div className={styles.fields}>
              <FormField label="Название" htmlFor="p-name" required error={errors.name}>
                <input
                  id="p-name"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Например: Нексу STANDART"
                  autoComplete="off"
                />
              </FormField>

              <FormField
                label="Slug"
                htmlFor="p-slug"
                required
                error={errors.slug}
                hint="Используется в URL. Латиница, цифры и дефисы."
              >
                <input
                  id="p-slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="nexu-standart"
                  autoComplete="off"
                />
              </FormField>

              <div className={styles.twoColFields}>
                <FormField
                  label="Категория"
                  htmlFor="p-category"
                  required
                  error={errors.categoryId}
                >
                  <select
                    id="p-category"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleCategoryChange}
                  >
                    <option value="">— Выберите категорию —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {'— '.repeat(c.depth)}
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Цена от, ₽" htmlFor="p-price">
                  <input
                    id="p-price"
                    type="number"
                    min="0"
                    name="priceFrom"
                    value={form.priceFrom}
                    onChange={handlePriceChange}
                    placeholder="0"
                  />
                </FormField>
              </div>

              <FormField label="Описание" htmlFor="p-desc">
                <textarea
                  id="p-desc"
                  name="description"
                  value={form.description}
                  onChange={handleDescChange}
                  placeholder="Краткое описание товара"
                  rows={5}
                />
              </FormField>
            </div>
          </Card>

          <Card>
            <h2 className={styles.cardTitle}>Характеристики</h2>
            <div className={styles.specsList}>
              {form.specifications.map((spec, i) => (
                <div key={i} className={styles.specRow}>
                  <FormField>
                    <input
                      placeholder="Параметр (например, Материал)"
                      value={spec.key}
                      onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <input
                      placeholder="Значение"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    />
                  </FormField>
                  <button
                    type="button"
                    className={styles.specRemoveBtn}
                    onClick={() => removeSpec(i)}
                    aria-label="Удалить характеристику"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.specsAddBtn}
              onClick={addSpec}
            >
              + Добавить характеристику
            </Button>
          </Card>

          <div className={styles.actionsRow}>
            <Button type="submit" variant="primary" loading={loading}>
              {mode === 'create' ? 'Создать товар' : 'Сохранить изменения'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(PATHS.ADMIN_PRODUCTS)}
            >
              Отмена
            </Button>
          </div>
        </div>

        <div className={styles.column}>
          <Card>
            <h2 className={styles.cardTitle}>Изображения</h2>
            <FileUpload folder="products" onUpload={handleImagesUploaded} />
            {form.images.length > 0 && (
              <div className={styles.imagesPreview}>
                {form.images.map((url) => (
                  <div key={url} className={styles.imageTile}>
                    <img src={url} alt="" />
                    <button
                      type="button"
                      className={styles.imageRemove}
                      onClick={() => removeImage(url)}
                      aria-label="Удалить изображение"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className={styles.cardTitle}>Публикация</h2>
            <div className={styles.togglesGroup}>
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>
                  Активен
                  <span className={styles.toggleHint}>Виден в каталоге</span>
                </span>
                <span className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={() => toggleBool('isActive')}
                  />
                  <span className={styles.switchTrack} />
                </span>
              </label>

              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>
                  Рекомендуемый
                  <span className={styles.toggleHint}>Выделен на главной</span>
                </span>
                <span className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={() => toggleBool('isFeatured')}
                  />
                  <span className={styles.switchTrack} />
                </span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}

const extractErrorMessage = (err: unknown): string => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: unknown } } }).response
    const msg = response?.data?.message
    if (Array.isArray(msg)) return msg.join(', ')
    if (typeof msg === 'string') return msg
  }
  return 'Не удалось сохранить товар'
}
