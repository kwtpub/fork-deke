import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
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
import type { Category } from '@entities/category'
import styles from './AdminCategoriesPage.module.scss'

interface CategoryFormState {
  name: string
  slug: string
  description: string
  image: string
  sortOrder: number
  parentId: string
}

const EMPTY_FORM: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
  image: '',
  sortOrder: 0,
  parentId: '',
}

interface FlatCategory extends Category {
  depth: number
}

const flatten = (items: Category[], depth = 0): FlatCategory[] =>
  items.flatMap((item) => [
    { ...item, depth },
    ...flatten(item.children ?? [], depth + 1),
  ])

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 6 15 12 9 18" />
  </svg>
)

const EmptyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

interface TreeProps {
  nodes: Category[]
  depth: number
  expanded: Record<string, boolean>
  selectedId: string | null
  onToggle: (id: string) => void
  onSelect: (node: Category) => void
}

const CategoryTree = ({
  nodes,
  depth,
  expanded,
  selectedId,
  onToggle,
  onSelect,
}: TreeProps) => (
  <ul className={styles.tree}>
    {nodes.map((node) => {
      const hasChildren = Boolean(node.children && node.children.length > 0)
      const isOpen = expanded[node.id] ?? true
      const isActive = selectedId === node.id
      return (
        <li key={node.id} className={styles.treeItem}>
          <div
            className={`${styles.node} ${isActive ? styles.nodeActive : ''}`}
            style={{ paddingLeft: 12 + depth * 16 }}
            onClick={() => onSelect(node)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect(node)
              }
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                className={styles.chevronBtn}
                onClick={(event) => {
                  event.stopPropagation()
                  onToggle(node.id)
                }}
                aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
              >
                <ChevronIcon open={isOpen} />
              </button>
            ) : (
              <span className={styles.chevronPlaceholder} aria-hidden="true" />
            )}
            {node.image ? (
              <img src={node.image} alt="" className={styles.nodeImage} />
            ) : (
              <span className={styles.nodeDot} aria-hidden="true" />
            )}
            <span className={styles.nodeLabel}>{node.name}</span>
            {typeof node.productsCount === 'number' && (
              <span className={styles.nodeBadge}>{node.productsCount}</span>
            )}
          </div>
          {hasChildren && isOpen && (
            <CategoryTree
              nodes={node.children ?? []}
              depth={depth + 1}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          )}
        </li>
      )
    })}
  </ul>
)

export const AdminCategoriesPage = () => {
  const toast = useToast()
  const confirm = useConfirm()

  const [tree, setTree] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>('idle')
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM)
  const [slugDirty, setSlugDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({})

  const flat = useMemo(() => flatten(tree), [tree])

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiInstance.get<{ data: Category[] }>(
        `/categories?t=${Date.now()}`,
      )
      setTree(response.data?.data ?? [])
    } catch {
      setTree([])
      toast.error('Не удалось загрузить категории')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSlugDirty(false)
  }

  const startCreate = () => {
    setSelectedId(null)
    resetForm()
    setMode('create')
  }

  const startEdit = (category: Category) => {
    setSelectedId(category.id)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      image: category.image ?? '',
      sortOrder: category.sortOrder ?? 0,
      parentId: category.parentId ?? '',
    })
    setSlugDirty(true)
    setErrors({})
    setMode('edit')
  }

  const cancelEditing = () => {
    setMode('idle')
    setSelectedId(null)
    resetForm()
  }

  const toggleNode = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }))
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugDirty ? prev.slug : toSlug(name),
    }))
  }

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlugDirty(true)
    setForm((prev) => ({ ...prev, slug: event.target.value }))
  }

  const handleFieldChange =
    (field: keyof CategoryFormState) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const raw = event.target.value
      const value = field === 'sortOrder' ? Number(raw) || 0 : raw
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleImageUpload = (urls: string[]) => {
    setForm((prev) => ({ ...prev, image: urls[0] ?? prev.image }))
  }

  const parentOptions = useMemo(() => {
    if (mode !== 'edit' || !selectedId) return flat
    const descendants = new Set<string>([selectedId])
    let changed = true
    while (changed) {
      changed = false
      for (const item of flat) {
        if (item.parentId && descendants.has(item.parentId) && !descendants.has(item.id)) {
          descendants.add(item.id)
          changed = true
        }
      }
    }
    return flat.filter((item) => !descendants.has(item.id))
  }, [flat, mode, selectedId])

  const validate = () => {
    const nextErrors: Partial<Record<keyof CategoryFormState, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Укажите название'
    if (!form.slug.trim()) nextErrors.slug = 'Укажите slug'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image.trim() || null,
        sortOrder: form.sortOrder,
        parentId: form.parentId || null,
      }
      if (mode === 'edit' && selectedId) {
        await apiInstance.patch(`/categories/${selectedId}`, payload)
        toast.success('Категория обновлена')
      } else {
        await apiInstance.post('/categories', payload)
        toast.success('Категория создана')
      }
      await loadCategories()
      setMode('idle')
      setSelectedId(null)
      resetForm()
    } catch (error) {
      const err = error as { response?: { data?: { message?: string | string[] } } }
      const message = err?.response?.data?.message
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Ошибка при сохранении'
      toast.error(text)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (mode !== 'edit' || !selectedId) return
    const ok = await confirm({
      title: 'Удалить категорию?',
      message: `Категория «${form.name}» будет удалена. Подкатегории станут корневыми.`,
      confirmText: 'Удалить',
      destructive: true,
    })
    if (!ok) return
    setDeleting(true)
    try {
      await apiInstance.delete(`/categories/${selectedId}`)
      toast.success('Категория удалена')
      await loadCategories()
      setMode('idle')
      setSelectedId(null)
      resetForm()
    } catch {
      toast.error('Не удалось удалить категорию')
    } finally {
      setDeleting(false)
    }
  }

  const renderForm = () => (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <div>
          <h2 className={styles.formTitle}>
            {mode === 'edit' ? 'Редактирование категории' : 'Новая категория'}
          </h2>
          <p className={styles.formSubtitle}>
            {mode === 'edit'
              ? 'Измените поля и сохраните результат'
              : 'Заполните поля и сохраните новую категорию'}
          </p>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={cancelEditing}
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>

      <FormField label="Название" htmlFor="cat-name" required error={errors.name}>
        <input
          id="cat-name"
          type="text"
          value={form.name}
          onChange={handleNameChange}
          placeholder="Например: Водосточные системы"
        />
      </FormField>

      <FormField
        label="Slug"
        htmlFor="cat-slug"
        required
        error={errors.slug}
        hint="Автозаполняется из названия. Только латиница и дефисы."
      >
        <input
          id="cat-slug"
          type="text"
          value={form.slug}
          onChange={handleSlugChange}
          placeholder="vodostochnye-sistemy"
        />
      </FormField>

      <FormField label="Описание" htmlFor="cat-description">
        <textarea
          id="cat-description"
          value={form.description}
          onChange={handleFieldChange('description')}
          rows={4}
          placeholder="Краткое описание категории"
        />
      </FormField>

      <FormField label="Родительская категория" htmlFor="cat-parent">
        <select
          id="cat-parent"
          value={form.parentId}
          onChange={handleFieldChange('parentId')}
        >
          <option value="">— Нет родителя —</option>
          {parentOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {`${'— '.repeat(item.depth)}${item.name}`}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Порядок сортировки" htmlFor="cat-sort">
        <input
          id="cat-sort"
          type="number"
          value={form.sortOrder}
          onChange={handleFieldChange('sortOrder')}
        />
      </FormField>

      <FormField label="Изображение категории">
        <div className={styles.imageBlock}>
          {form.image ? (
            <div className={styles.imagePreview}>
              <img src={form.image} alt="Предпросмотр" />
              <button
                type="button"
                className={styles.imageRemove}
                onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
              >
                Удалить
              </button>
            </div>
          ) : null}
          <FileUpload folder="categories" multiple={false} onUpload={handleImageUpload} />
        </div>
      </FormField>

      <div className={styles.formActions}>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          {mode === 'edit' ? 'Сохранить' : 'Создать'}
        </Button>
        <Button variant="secondary" onClick={cancelEditing}>
          Отмена
        </Button>
        {mode === 'edit' && (
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Удалить
          </Button>
        )}
      </div>
    </div>
  )

  const renderEmpty = () => (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <EmptyIcon />
      </div>
      <h3 className={styles.emptyTitle}>Категория не выбрана</h3>
      <p className={styles.emptyText}>
        Выберите категорию в дереве слева, чтобы отредактировать её, или создайте новую.
      </p>
      <Button variant="primary" onClick={startCreate}>
        + Новая категория
      </Button>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Категории — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Категории"
        subtitle={`${flat.length} категорий`}
        action={
          <Button variant="primary" onClick={startCreate}>
            + Новая категория
          </Button>
        }
      />

      <div className={styles.layout}>
        <Card className={styles.treeCard}>
          <div className={styles.treeHeader}>
            <h2 className={styles.treeTitle}>Дерево категорий</h2>
          </div>
          {loading ? (
            <p className={styles.treeLoading}>Загрузка…</p>
          ) : tree.length === 0 ? (
            <p className={styles.treeEmpty}>Категорий пока нет</p>
          ) : (
            <CategoryTree
              nodes={tree}
              depth={0}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={toggleNode}
              onSelect={startEdit}
            />
          )}
        </Card>

        <Card className={styles.formCard}>
          {mode === 'idle' ? renderEmpty() : renderForm()}
        </Card>
      </div>
    </>
  )
}
