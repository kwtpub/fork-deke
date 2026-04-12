import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Modal } from '@shared/ui/Modal/Modal'
import { Input } from '@shared/ui/Input/Input'
import { Button } from '@shared/ui/Button/Button'
import { apiInstance } from '@shared/api/baseApi'
import { clearCart, type CartItem } from '@features/cart/model/cartSlice'
import styles from './OrderModal.module.scss'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  productId?: string
  productName?: string
  cartItems?: CartItem[]
}

export const OrderModal = ({ isOpen, onClose, productId, productName, cartItems }: OrderModalProps) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Введите имя'
    if (!phone.trim()) errs.phone = 'Введите телефон'
    else if (!/^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(phone.trim()))
      errs.phone = 'Неверный формат телефона'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Неверный email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const buildMessage = () => {
    const parts: string[] = []
    if (message.trim()) parts.push(message.trim())
    if (cartItems && cartItems.length > 0) {
      parts.push('Товары из корзины:')
      cartItems.forEach((item) => {
        parts.push(`- ${item.name} x${item.quantity}${item.price ? ` (${item.price.toLocaleString('ru-RU')} ₽)` : ''}`)
      })
    }
    return parts.join('\n') || undefined
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await apiInstance.post('/orders', {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: buildMessage(),
        productId: productId || (cartItems?.length === 1 ? cartItems[0].id : undefined),
        type: 'order',
      })
      setSuccess(true)
      if (cartItems && cartItems.length > 0) {
        dispatch(clearCart())
      }
    } catch {
      setErrors({ form: 'Произошла ошибка. Попробуйте ещё раз.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setEmail('')
    setMessage('')
    setErrors({})
    setSuccess(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={success ? undefined : 'Оставить заявку'}>
      {success ? (
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          <h3>Заявка отправлена!</h3>
          <p>Наш менеджер свяжется с вами в ближайшее время</p>
          <Button onClick={handleClose}>Закрыть</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {productName && <p className={styles.productInfo}>Товар: <strong>{productName}</strong></p>}
          {cartItems && cartItems.length > 0 && (
            <div className={styles.cartSummary}>
              <p className={styles.cartTitle}>Товары ({cartItems.length}):</p>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <span>{item.name}</span>
                  <span className={styles.cartQty}>x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
          <Input
            label="Имя *"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Телефон *"
            placeholder="+7 (999) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <Input
            label="Email"
            placeholder="email@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <div className={styles.textareaWrap}>
            <label className={styles.label}>Сообщение</label>
            <textarea
              className={styles.textarea}
              placeholder="Опишите ваш запрос..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {errors.form && <p className={styles.formError}>{errors.form}</p>}
          <Button type="submit" size="lg" loading={loading} className={styles.submit}>
            Отправить заявку
          </Button>
        </form>
      )}
    </Modal>
  )
}
