import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import {
  Button,
  DataTable,
  PageHeader,
  useConfirm,
  useToast,
  type Column,
} from '@shared/ui/admin'
import type { News } from '@entities/news'
import { PATHS } from '@app/routes/paths'
import styles from './AdminNewsPage.module.scss'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('ru-RU') : '—'

export const AdminNewsPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  const loadNews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiInstance.get<{ data: News[] }>('/news?limit=100')
      setNews(response.data?.data ?? [])
    } catch {
      setNews([])
      toast.error('Не удалось загрузить новости')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadNews()
  }, [loadNews])

  const handleDelete = async (item: News) => {
    const ok = await confirm({
      title: 'Удалить новость?',
      message: `Новость «${item.title}» будет удалена без возможности восстановления.`,
      confirmText: 'Удалить',
      destructive: true,
    })
    if (!ok) return
    try {
      await apiInstance.delete(`/news/${item.id}`)
      toast.success('Новость удалена')
      await loadNews()
    } catch {
      toast.error('Не удалось удалить новость')
    }
  }

  const columns: Column<News>[] = [
    {
      key: 'cover',
      label: 'Обложка',
      width: '96px',
      render: (row) =>
        row.coverImage ? (
          <img className={styles.cover} src={row.coverImage} alt="" />
        ) : (
          <div className={`${styles.cover} ${styles.coverPlaceholder}`} aria-hidden="true" />
        ),
    },
    {
      key: 'title',
      label: 'Заголовок',
      render: (row) => (
        <div className={styles.titleCell}>
          <span className={styles.titleText}>{row.title}</span>
          <span className={styles.slug}>{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'publishedAt',
      label: 'Дата публикации',
      width: '180px',
      render: (row) => (
        <span className={styles.date}>{formatDate(row.publishedAt ?? row.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      width: '140px',
      render: (row) => (
        <span
          className={`${styles.badge} ${
            row.isPublished ? styles.badgePublished : styles.badgeDraft
          }`}
        >
          {row.isPublished ? 'Опубликовано' : 'Черновик'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      width: '200px',
      align: 'right',
      render: (row) => (
        <div
          className={styles.actions}
          onClick={(event) => event.stopPropagation()}
          role="presentation"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(PATHS.ADMIN_NEWS_EDIT(row.id))}
          >
            Изменить
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>
            Удалить
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Helmet>
        <title>Новости — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Новости"
        subtitle={`${news.length} записей`}
        action={
          <Link to={PATHS.ADMIN_NEWS_NEW} className={styles.createLink}>
            <Button variant="primary">+ Создать</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        rows={news}
        loading={loading}
        emptyText="Новостей пока нет"
        getRowKey={(row) => row.id}
        onRowClick={(row) => navigate(PATHS.ADMIN_NEWS_EDIT(row.id))}
      />
    </>
  )
}
