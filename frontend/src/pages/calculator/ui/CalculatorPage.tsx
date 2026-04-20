import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { addToCart } from '@features/cart/model/cartSlice'
import styles from './CalculatorPage.module.scss'

type TabKey = 'foundation' | 'walls' | 'roof' | 'floor'

interface TabDef {
  key: TabKey
  label: string
}

const TABS: TabDef[] = [
  { key: 'foundation', label: 'Фундамент' },
  { key: 'walls', label: 'Стены' },
  { key: 'roof', label: 'Кровля' },
  { key: 'floor', label: 'Пол' },
]

const CONCRETE_GRADES = ['М200 В15', 'М250 В20', 'М300 В22.5', 'М350 В25', 'М400 В30']

interface ResultRow {
  label: string
  value: string
}

interface CalcResult {
  rows: ResultRow[]
  total: number
}

const formatNumber = (n: number) => n.toLocaleString('ru-RU')
const formatRub = (n: number) => `${formatNumber(Math.round(n))} \u20BD`

const ChevronDown = () => (
  <svg
    className={styles.chevron}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const CalculatorPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<TabKey>('foundation')
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [depth, setDepth] = useState('1.5')
  const [grade, setGrade] = useState('М300 В22.5')

  const result = useMemo<CalcResult | null>(() => {
    if (activeTab !== 'foundation') return null
    const l = parseFloat(length)
    const w = parseFloat(width)
    const d = parseFloat(depth)
    if (!l || !w || !d || l <= 0 || w <= 0 || d <= 0) return null

    const volume = Math.round(l * w * d) // м³ бетона
    const rebar = Math.round(volume * 20) // кг арматуры ~20кг/м³
    const formwork = Math.round((2 * (l + w) * d) + (l * w)) // м²
    const sand = Math.max(1, Math.round(volume * 0.125)) // м³

    const priceConcrete = 5500 // ₽/м³
    const priceRebar = 75 // ₽/кг
    const priceFormwork = 450 // ₽/м²
    const priceSand = 1200 // ₽/м³
    const total =
      volume * priceConcrete +
      rebar * priceRebar +
      formwork * priceFormwork +
      sand * priceSand

    return {
      rows: [
        { label: `Бетон ${grade.split(' ')[0]}`, value: `${formatNumber(volume)} \u043C\u00B3` },
        { label: 'Арматура 12мм', value: `${formatNumber(rebar)} кг` },
        { label: 'Опалубка', value: `${formatNumber(formwork)} \u043C\u00B2` },
        { label: 'Песок', value: `${formatNumber(sand)} \u043C\u00B3` },
      ],
      total,
    }
  }, [activeTab, length, width, depth, grade])

  const handleCalculate = () => {
    // triggered by form submit; memo already recomputes on change
  }

  const handleAddToCart = () => {
    if (!result) return
    dispatch(
      addToCart({
        id: `calc-${activeTab}-${Date.now()}`,
        name: `Расчёт: ${TABS.find((t) => t.key === activeTab)?.label ?? ''}`,
        slug: 'calculator-result',
        categorySlug: 'calculator',
        image: '',
        price: result.total,
        quantity: 1,
      }),
    )
  }

  return (
    <>
      <Helmet>
        <title>Калькулятор материалов — Нексу</title>
      </Helmet>

      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Калькулятор' },
            ]}
          />

          <h1 className={styles.title}>Калькулятор материалов</h1>
          <p className={styles.subtitle}>
            Рассчитайте необходимое количество материалов для вашего проекта
          </p>

          <div className={styles.cols}>
            <form
              className={styles.formCard}
              onSubmit={(e) => {
                e.preventDefault()
                handleCalculate()
              }}
            >
              <div className={styles.tabs} role="tablist">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    className={
                      activeTab === tab.key
                        ? `${styles.tab} ${styles.tabActive}`
                        : styles.tab
                    }
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'foundation' ? (
                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="calc-length">
                      Длина (м)
                    </label>
                    <input
                      id="calc-length"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="calc-width">
                      Ширина (м)
                    </label>
                    <input
                      id="calc-width"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="calc-depth">
                      Глубина (м)
                    </label>
                    <input
                      id="calc-depth"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="calc-grade">
                      Марка бетона
                    </label>
                    <div className={styles.selectWrap}>
                      <select
                        id="calc-grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className={styles.select}
                      >
                        {CONCRETE_GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.stub}>
                  Калькулятор для раздела «{TABS.find((t) => t.key === activeTab)?.label}» скоро появится.
                </div>
              )}

              <button type="submit" className={styles.submitBtn}>
                Рассчитать
              </button>
            </form>

            <aside className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h2 className={styles.resultTitle}>Результат расчёта</h2>
              </div>

              <div className={styles.resultBody}>
                {result ? (
                  <>
                    {result.rows.map((row) => (
                      <div key={row.label} className={styles.resultRow}>
                        <span className={styles.resultLabel}>{row.label}</span>
                        <span className={styles.resultValue}>{row.value}</span>
                      </div>
                    ))}
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Итого:</span>
                      <span className={styles.totalValue}>{formatRub(result.total)}</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.empty}>
                    Введите параметры, чтобы увидеть расчёт.
                  </div>
                )}
              </div>

              <div className={styles.resultFooter}>
                <button
                  type="button"
                  className={styles.cartBtn}
                  onClick={handleAddToCart}
                  disabled={!result}
                >
                  Добавить в корзину
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
