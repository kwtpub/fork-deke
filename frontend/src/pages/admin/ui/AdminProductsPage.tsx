import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiInstance } from '@shared/api/baseApi'
import { Button } from '@shared/ui/Button/Button'
import type { Product } from '@entities/product'

const formatPrice = (price?: number) =>
  price ? `от ${price.toLocaleString('ru-RU')} ₽` : '—'

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = () => {
    setLoading(true)
    apiInstance.get('/products/admin/all?limit=100')
      .then((r) => setProducts(Array.isArray(r.data?.data) ? r.data.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [])

  const toggleActive = async (id: string, isActive: boolean) => {
    await apiInstance.patch(`/products/${id}`, { isActive: !isActive })
    loadProducts()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Удалить продукт?')) return
    await apiInstance.delete(`/products/${id}`)
    loadProducts()
  }

  return (
    <>
      <Helmet><title>Продукты — Döcke Admin</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121' }}>Продукты</h1>
          <p style={{ color: '#757575', fontSize: 14 }}>{products.length} позиций</p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary">+ Добавить продукт</Button>
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#757575', padding: '40px 0' }}>Загрузка...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
                {['Название', 'Slug', 'Цена', 'Статус', 'Действия'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#757575', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{
                  borderBottom: i < products.length - 1 ? '1px solid #f0f0f0' : 'none',
                  background: '#fff',
                }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#212121' }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', color: '#757575', fontSize: 13, fontFamily: 'monospace' }}>{p.slug}</td>
                  <td style={{ padding: '14px 16px', color: '#424242' }}>{formatPrice(p.priceFrom)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: p.isActive ? '#e8f5e9' : '#fce4ec',
                      color: p.isActive ? '#2e7d32' : '#c62828',
                    }}>
                      {p.isActive ? 'Активен' : 'Скрыт'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => toggleActive(p.id, p.isActive ?? true)}
                        style={{
                          padding: '5px 12px', border: '1px solid #e0e0e0',
                          borderRadius: 6, cursor: 'pointer', fontSize: 12,
                          background: '#fff', color: '#424242',
                        }}
                      >
                        {p.isActive ? 'Скрыть' : 'Показать'}
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        style={{
                          padding: '5px 12px', border: '1px solid #ffcdd2',
                          borderRadius: 6, cursor: 'pointer', fontSize: 12,
                          background: '#fff', color: '#c62828',
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9e9e9e', padding: '40px 0' }}>Продукты не найдены</p>
          )}
        </div>
      )}
    </>
  )
}
