import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { apiInstance } from '@shared/api/baseApi'
import { Input } from '@shared/ui/Input/Input'
import { useDebounce } from '@shared/hooks/useDebounce'
import { useEffect } from 'react'

interface SearchResult { products: Array<{ id: string; name: string; slug: string; categoryId: string }>; news: Array<{ id: string; title: string; slug: string }> }

export const SearchPage = () => {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 400)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!debounced || debounced.length < 2) { setResult(null); return }
    setLoading(true)
    apiInstance.get('/search', { params: { q: debounced } })
      .then((r) => setResult((r.data as { data: SearchResult }).data))
      .finally(() => setLoading(false))
  }, [debounced])

  return (
    <>
      <Helmet><title>Поиск — Döcke</title></Helmet>
      <div className="container" style={{ padding: '40px 20px', maxWidth: 800 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>Поиск</h1>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Введите запрос..." style={{ marginBottom: 32 }} />
        {loading && <p style={{ color: '#9e9e9e' }}>Поиск...</p>}
        {result && (
          <div>
            {result.products.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Продукция</h2>
                {result.products.map((p) => (
                  <Link key={p.id} to={`/catalog/${p.categoryId}/${p.slug}`} style={{ display: 'block', padding: '8px 0', color: '#e85d04', borderBottom: '1px solid #e0e0e0' }}>{p.name}</Link>
                ))}
              </div>
            )}
            {result.news.length > 0 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Новости</h2>
                {result.news.map((n) => (
                  <Link key={n.id} to={`/news/${n.slug}`} style={{ display: 'block', padding: '8px 0', color: '#e85d04', borderBottom: '1px solid #e0e0e0' }}>{n.title}</Link>
                ))}
              </div>
            )}
            {!result.products.length && !result.news.length && <p style={{ color: '#9e9e9e' }}>По запросу «{query}» ничего не найдено.</p>}
          </div>
        )}
      </div>
    </>
  )
}
