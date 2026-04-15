import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'

const OFFICES = [
  {
    city: 'Москва (главный офис)',
    address: 'г. Москва, ул. Строительная, 12, офис 301',
    phone: '+7 (495) 123-45-67',
    email: 'moscow@nexu.su',
    schedule: 'Пн–Пт: 9:00–18:00',
  },
  {
    city: 'Санкт-Петербург',
    address: 'г. Санкт-Петербург, пр. Невский, 48',
    phone: '+7 (812) 987-65-43',
    email: 'spb@nexu.su',
    schedule: 'Пн–Пт: 9:00–18:00',
  },
  {
    city: 'Екатеринбург',
    address: 'г. Екатеринбург, ул. Малышева, 33',
    phone: '+7 (343) 555-44-33',
    email: 'ekb@nexu.su',
    schedule: 'Пн–Пт: 9:00–17:00',
  },
]

export const ContactsPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <Helmet>
        <title>Контакты — Нексу</title>
        <meta name="description" content="Контакты компании Нексу — адреса офисов, телефоны, форма обратной связи." />
      </Helmet>

      <section style={{ background: 'var(--color-primary)', color: '#fff', padding: '60px 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]} />
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: '24px 0 12px' }}>Контакты</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>Мы всегда рады помочь — выберите удобный способ связи</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {OFFICES.map((o) => (
              <div key={o.city} style={{
                background: '#fff', border: '1px solid #e0e0e0',
                borderRadius: 16, padding: 28,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--color-primary)' }}>{o.city}</h3>
                <p style={{ color: '#424242', marginBottom: 8, display: 'flex', gap: 8 }}>
                  <span>📍</span> {o.address}
                </p>
                <p style={{ color: '#424242', marginBottom: 8, display: 'flex', gap: 8 }}>
                  <span>📞</span> <a href={`tel:${o.phone}`} style={{ color: 'inherit' }}>{o.phone}</a>
                </p>
                <p style={{ color: '#424242', marginBottom: 8, display: 'flex', gap: 8 }}>
                  <span>✉️</span> <a href={`mailto:${o.email}`} style={{ color: 'inherit' }}>{o.email}</a>
                </p>
                <p style={{ color: '#757575', fontSize: 13, marginTop: 12 }}>🕐 {o.schedule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fafafa' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <h2 className="section-title">Написать нам</h2>
          {sent ? (
            <div style={{
              background: '#e8f5e9', border: '1px solid #a5d6a7',
              borderRadius: 12, padding: 32, textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Сообщение отправлено!</h3>
              <p style={{ color: '#616161' }}>Мы свяжемся с вами в течение одного рабочего дня.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                label="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Телефон"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#424242' }}>Сообщение</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  style={{
                    padding: '10px 14px', border: '1px solid #e0e0e0',
                    borderRadius: 8, fontSize: 15, resize: 'vertical',
                    fontFamily: 'inherit', outline: 'none',
                  }}
                />
              </div>
              <Button type="submit" variant="primary" size="lg">Отправить</Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
