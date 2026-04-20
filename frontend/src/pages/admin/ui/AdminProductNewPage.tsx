import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PageHeader } from '@shared/ui/admin'
import { PATHS } from '@app/routes/paths'
import { AdminProductForm, EMPTY_PRODUCT_FORM } from './AdminProductForm'
import styles from './AdminProductForm.module.scss'

export const AdminProductNewPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Новый товар — Нексу Admin</title>
      </Helmet>

      <PageHeader
        title="Новый товар"
        subtitle="Заполните карточку и сохраните"
        action={
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate(PATHS.ADMIN_PRODUCTS)}
          >
            ← К списку
          </button>
        }
      />

      <AdminProductForm mode="create" initial={EMPTY_PRODUCT_FORM} />
    </>
  )
}
