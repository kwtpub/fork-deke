import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@app/store'
import { removeFromCart, updateQuantity } from '@features/cart/model/cartSlice'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Button } from '@shared/ui/Button/Button'
import { OrderModal } from '@features/order-modal/ui/OrderModal'
import { formatPrice } from '@shared/lib/formatPrice'
import styles from './CartPage.module.scss'

const MinusIcon = () => (
  <svg width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden="true">
    <path d="M1 1H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2.5 4H13.5M6 4V2.75C6 2.33579 6.33579 2 6.75 2H9.25C9.66421 2 10 2.33579 10 2.75V4M11.75 4L11.3 12.4C11.27 13.0 10.77 13.5 10.17 13.5H5.83C5.23 13.5 4.73 13.0 4.7 12.4L4.25 4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CartPage = () => {
  const dispatch = useDispatch()
  const items = useSelector((s: RootState) => s.cart.items)
  const [orderOpen, setOrderOpen] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const total = subtotal

  return (
    <>
      <Helmet><title>Корзина — Нексу</title></Helmet>
      <div className={styles.page}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Корзина' },
            ]}
          />

          <h1 className={styles.title}>Корзина</h1>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Ваша корзина пуста</p>
              <Link to="/catalog">
                <Button>Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <div className={styles.columns}>
              <div className={styles.leftCol}>
                <div className={styles.tblHeader}>
                  <span className={styles.colProduct}>товар</span>
                  <span className={styles.colPrice}>Цена</span>
                  <span className={styles.colQty}>Кол-во</span>
                  <span className={styles.colTotal}>Итого</span>
                  <span className={styles.colAction} aria-hidden="true" />
                </div>

                {items.map((item) => {
                  const lineTotal = item.price * item.quantity
                  return (
                    <div key={item.id} className={styles.itemRow}>
                      <div className={styles.productCell}>
                        <Link
                          to={`/catalog/${item.categorySlug}/${item.slug}`}
                          className={styles.imageWrap}
                        >
                          <img
                            src={item.image || '/images/placeholder.jpg'}
                            alt={item.name}
                          />
                        </Link>
                        <Link
                          to={`/catalog/${item.categorySlug}/${item.slug}`}
                          className={styles.name}
                        >
                          {item.name}
                        </Link>
                      </div>

                      <div className={styles.priceCell}>
                        <span className={styles.mobileLabel}>Цена</span>
                        <span>{item.price > 0 ? formatPrice(item.price) : '—'}</span>
                      </div>

                      <div className={styles.qtyCell}>
                        <span className={styles.mobileLabel}>Кол-во</span>
                        <div className={styles.qtyStepper}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            aria-label="Уменьшить количество"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            aria-label="Увеличить количество"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                            }
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>

                      <div className={styles.totalCell}>
                        <span className={styles.mobileLabel}>Итого</span>
                        <span className={styles.totalValue}>
                          {item.price > 0 ? formatPrice(lineTotal) : '—'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={styles.removeBtn}
                        aria-label="Удалить товар"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )
                })}
              </div>

              <aside className={styles.rightCol}>
                <div className={styles.summary}>
                  <h2 className={styles.summaryTitle}>Итого заказа</h2>

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Подытог</span>
                    <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Доставка</span>
                    <span className={styles.summaryValue}>Бесплатно</span>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Итого</span>
                    <span className={styles.totalAmount}>{formatPrice(total)}</span>
                  </div>

                  <button
                    type="button"
                    className={styles.checkoutBtn}
                    onClick={() => setOrderOpen(true)}
                  >
                    Оформить заказ
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <OrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        cartItems={items}
      />
    </>
  )
}
