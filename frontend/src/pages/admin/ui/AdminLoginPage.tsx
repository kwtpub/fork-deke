import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { adminAuthApi, tokenStorage } from '@shared/api/adminApi'
import { Button } from '@shared/ui/Button/Button'
import { Input } from '@shared/ui/Input/Input'

export const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { accessToken } = await adminAuthApi.login(email, password)
      tokenStorage.set(accessToken)
      navigate('/admin')
    } catch {
      setError('Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Вход — Döcke Admin</title></Helmet>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f5f5f5',
      }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '48px 40px',
          width: '100%', maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, background: 'var(--color-primary)',
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px', fontSize: 28,
            }}>🏠</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#212121' }}>Döcke Admin</h1>
            <p style={{ color: '#757575', fontSize: 14, marginTop: 4 }}>Войдите в панель управления</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && (
              <p style={{ color: '#d32f2f', fontSize: 14, background: '#ffebee', padding: '10px 14px', borderRadius: 8 }}>
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ marginTop: 8 }}>
              Войти
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
