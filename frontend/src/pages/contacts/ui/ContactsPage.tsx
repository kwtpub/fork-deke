import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import styles from './ContactsPage.module.scss'

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M9 4v13" />
    <path d="M15 7v13" />
  </svg>
)

type FormState = { name: string; email: string; phone: string; message: string }

export const ContactsPage = () => {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  const update = (key: keyof FormState) =>
    (e: { target: { value: string } }) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <>
      <Helmet>
        <title>Контакты — Нексу</title>
        <meta
          name="description"
          content="Контакты компании Нексу — телефон, email, адрес офиса и форма обратной связи."
        />
      </Helmet>

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Контакты</h1>

            <div className={styles.columns}>
              <div className={styles.infoList}>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}><PhoneIcon /></span>
                  <div className={styles.infoBody}>
                    <span className={styles.infoPrimary}>
                      <a href="tel:+78005553535">8 (800) 555-35-35</a>
                    </span>
                    <span className={styles.infoSecondary}>Бесплатный звонок по России</span>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}><MailIcon /></span>
                  <div className={styles.infoBody}>
                    <span className={styles.infoPrimary}>
                      <a href="mailto:info@nexu.ru">info@nexu.ru</a>
                    </span>
                    <span className={styles.infoSecondaryLg}>
                      <a href="mailto:sales@nexu.ru">sales@nexu.ru</a>
                    </span>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}><MapPinIcon /></span>
                  <div className={styles.infoBody}>
                    <span className={styles.infoPrimary}>г. Москва, ул. Строителей, 42</span>
                    <span className={styles.infoSecondary}>Бизнес-центр СтройСити, 3 этаж</span>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}><ClockIcon /></span>
                  <div className={styles.infoBody}>
                    <span className={styles.infoPrimary}>Пн-Пт: 8:00-20:00</span>
                    <span className={styles.infoSecondary}>Сб: 9:00-18:00</span>
                    <span className={styles.infoSecondary}>Вс: выходной</span>
                  </div>
                </div>
              </div>

              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Напишите нам</h2>
                {sent ? (
                  <div className={styles.successBox}>
                    <h3>Сообщение отправлено</h3>
                    <p>Мы свяжемся с вами в ближайшее время.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                      <label htmlFor="contact-name" className={styles.label}>Имя</label>
                      <input
                        id="contact-name"
                        className={styles.input}
                        type="text"
                        value={form.name}
                        onChange={update('name')}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="contact-email" className={styles.label}>Email</label>
                      <input
                        id="contact-email"
                        className={styles.input}
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="contact-phone" className={styles.label}>Телефон</label>
                      <input
                        id="contact-phone"
                        className={styles.input}
                        type="tel"
                        value={form.phone}
                        onChange={update('phone')}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="contact-message" className={styles.label}>Сообщение</label>
                      <textarea
                        id="contact-message"
                        className={styles.textarea}
                        value={form.message}
                        onChange={update('message')}
                        required
                      />
                    </div>
                    <button type="submit" className={styles.submit}>Отправить</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.mapSection}>
          <div className={styles.container}>
            <div className={styles.mapArea} role="img" aria-label="Интерактивная карта — г. Москва, ул. Строителей, 42">
              <span className={styles.mapIcon}><MapIcon /></span>
              <span className={styles.mapLabel}>Интерактивная карта</span>
              <span className={styles.mapAddress}>г. Москва, ул. Строителей, 42</span>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
