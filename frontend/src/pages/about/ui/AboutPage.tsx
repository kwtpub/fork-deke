import { Helmet } from 'react-helmet-async'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'

const TIMELINE = [
  { year: '2007', text: 'Основание компании Döcke в России. Первые поставки виниловых фасадных материалов.' },
  { year: '2009', text: 'Запуск собственного производства виниловых панелей в Подмосковье.' },
  { year: '2012', text: 'Расширение линейки — выпуск водосточных систем и гибкой черепицы SHINGLE.' },
  { year: '2015', text: 'Выход на рынок металлического сайдинга. 1000+ дилеров по всей России.' },
  { year: '2018', text: 'Партнёрство с датским брендом DOLLE — начало продаж чердачных лестниц.' },
  { year: '2021', text: 'Запуск обновлённой линейки Döcke LUX с расширенной цветовой палитрой (24 цвета).' },
  { year: '2024', text: 'Более 5 000 реализованных проектов и представительства в 80 регионах России.' },
]

const CERTIFICATES = [
  'ISO 9001:2015 — система менеджмента качества',
  'ГОСТ 32614-2012 — виниловые облицовочные панели',
  'Пожарный сертификат — класс горючести Г1',
  'Экологический сертификат — отсутствие вредных примесей',
]

export const AboutPage = () => (
  <>
    <Helmet>
      <title>О компании — Döcke</title>
      <meta name="description" content="История и ценности компании Döcke — производителя строительных материалов для фасадов и кровли." />
    </Helmet>

    {/* Hero */}
    <section style={{ background: 'var(--color-primary)', color: '#fff', padding: '60px 0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'О компании' }]} />
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '24px 0 12px' }}>О компании Döcke</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600 }}>
          Производитель фасадных и кровельных материалов с 2007 года.
          Надёжность, проверенная на тысячах объектов по всей России.
        </p>
      </div>
    </section>

    {/* Mission */}
    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Наша миссия</h2>
            <p style={{ color: '#616161', lineHeight: 1.8, marginBottom: 16 }}>
              Döcke производит строительные материалы, которые делают дома красивее, теплее и долговечнее.
              Мы убеждены, что качественный фасад — это не роскошь, а доступная необходимость для каждого.
            </p>
            <p style={{ color: '#616161', lineHeight: 1.8 }}>
              Вся продукция проходит многоступенчатый контроль качества и соответствует российским и международным стандартам.
              Мы даём честную гарантию сроком до 50 лет.
            </p>
          </div>
          <div style={{
            background: '#f5f5f5', borderRadius: 16, padding: 40,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
          }}>
            {[
              { num: '17+', label: 'лет на рынке' },
              { num: '5000+', label: 'проектов' },
              { num: '80', label: 'регионов России' },
              { num: '1000+', label: 'дилеров' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)' }}>{num}</div>
                <div style={{ color: '#757575', fontSize: 14, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section" style={{ background: '#fafafa' }}>
      <div className="container">
        <h2 className="section-title">История компании</h2>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {TIMELINE.map(({ year, text }) => (
            <div key={year} style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
              <div style={{
                minWidth: 60, height: 60, borderRadius: '50%',
                background: 'var(--color-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>{year}</div>
              <div style={{ paddingTop: 16, borderTop: '1px solid #e0e0e0', flex: 1, color: '#424242', lineHeight: 1.7 }}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Certificates */}
    <section className="section">
      <div className="container">
        <h2 className="section-title">Сертификаты и стандарты</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {CERTIFICATES.map((cert) => (
            <div key={cert} style={{
              background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 24,
              display: 'flex', gap: 16, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>✓</span>
              <p style={{ color: '#424242', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{cert}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
)
