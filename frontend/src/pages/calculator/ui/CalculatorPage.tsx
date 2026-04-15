import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Breadcrumb } from '@shared/ui/Breadcrumb/Breadcrumb'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'
import { apiInstance } from '@shared/api/baseApi'
import styles from './CalculatorPage.module.scss'

export const CalculatorPage = () => {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState<{ area: number; panelsCount: number; packagesCount: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const calculate = async () => {
    setLoading(true)
    try {
      const res = await apiInstance.post('/calculator/calculate', {
        type: 'siding', width: parseFloat(width), height: parseFloat(height),
      })
      setResult((res.data as { data: typeof result }).data)
    } catch { setResult(null) }
    finally { setLoading(false) }
  }

  return (
    <>
      <Helmet><title>Калькулятор материалов — Нексу</title></Helmet>
      <div className="container" style={{ padding: '40px 20px', maxWidth: 640 }}>
        <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Калькулятор' }]} />
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '24px 0 8px' }}>Калькулятор материалов</h1>
        <p style={{ color: '#616161', marginBottom: 32 }}>Рассчитайте необходимое количество материалов</p>

        <div className={styles.form}>
          <Input label="Ширина стены (м)" type="number" min="0.1" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Например: 10" />
          <Input label="Высота стены (м)" type="number" min="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Например: 6" />
          <Button onClick={calculate} loading={loading} disabled={!width || !height} size="lg">Рассчитать</Button>
        </div>

        {result && (
          <div className={styles.result}>
            <h2>Результат расчёта</h2>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}><span>{result.area} м²</span><p>Площадь</p></div>
              <div className={styles.resultItem}><span>{result.panelsCount} шт</span><p>Панелей</p></div>
              <div className={styles.resultItem}><span>{result.packagesCount} уп</span><p>Упаковок</p></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
