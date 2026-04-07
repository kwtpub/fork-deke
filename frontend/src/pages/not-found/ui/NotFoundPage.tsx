import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Button } from '@shared/ui/Button/Button'

export const NotFoundPage = () => (
  <>
    <Helmet><title>Страница не найдена — Döcke</title></Helmet>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 20 }}>
      <h1 style={{ fontSize: 96, fontWeight: 900, color: '#e85d04', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: 28, fontWeight: 700, margin: '16px 0 8px' }}>Страница не найдена</h2>
      <p style={{ color: '#616161', marginBottom: 32 }}>Запрошенная страница не существует или была перемещена.</p>
      <Link to="/"><Button size="lg">На главную</Button></Link>
    </div>
  </>
)
