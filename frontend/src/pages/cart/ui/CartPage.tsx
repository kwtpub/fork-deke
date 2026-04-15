import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@app/store'
import { removeFromCart, updateQuantity, clearCart } from '@features/cart/model/cartSlice'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Button } from '@shared/ui/Button/Button'
import { OrderModal } from '@features/order-modal/ui/OrderModal'
import { formatPriceFrom } from '@shared/lib/formatPrice'
import styles from './CartPage.module.scss'

export const CartPage = () => {
  const dispatch = useDispatch()
  const items = useSelector((s: RootState) => s.cart.items)
  const [orderOpen, setOrderOpen] = useState(false)

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <>
      <Helmet><title>Корзина — Нексу</title></Helmet>
      <div className={styles.page}>
        <div className="container">
          <Breadcrumb items={[
            { label: 'Главная', href: '/' },
            { label: 'Корзина' },
          ]} />

          <h1 className={styles.title}>Корзина</h1>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Корзина пуста</p>
              <Link to="/catalog"><Button>Перейти в каталог</Button></Link>
            </div>
          ) : (
            <>
              <div className={styles.list}>
                {items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <Link to={`/catalog/${item.categorySlug}/${item.slug}`} className={styles.imageWrap}>
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                    </Link>
                    <div className={styles.info}>
                      <Link to={`/catalog/${item.categorySlug}/${item.slug}`} className={styles.name}>
                        {item.name}
                      </Link>
                      {item.price > 0 && <p className={styles.price}>{formatPriceFrom(item.price)}</p>}
                    </div>
                    <div className={styles.quantity}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      >
                        +
                      </button>
                    </div>
                    <button className={styles.remove} onClick={() => dispatch(removeFromCart(item.id))}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>
                  Очистить корзину
                </button>
                <div className={styles.totalBlock}>
                  {total > 0 && <p className={styles.total}>Итого: <strong>{total.toLocaleString('ru-RU')} ₽</strong></p>}
                  <Button size="lg" onClick={() => setOrderOpen(true)}>
                    Оставить заявку
                  </Button>
                </div>
              </div>
            </>
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
