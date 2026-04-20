import { apiInstance } from '@shared/api/baseApi'
import type { PaginatedResponse } from '@shared/api/apiTypes'
import type { Product, ProductListParams } from '../model/productTypes'

export interface AdminProductPayload {
  name: string
  slug: string
  description?: string | null
  priceFrom?: number | null
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  images: string[]
  specifications?: Record<string, string>
}

export const productApi = {
  getList: (params: ProductListParams) =>
    apiInstance.get<{ data: PaginatedResponse<Product> }>('/products', { params }).then((r) => r.data.data),

  getBySlug: (categorySlug: string, productSlug: string) =>
    apiInstance.get<{ data: Product }>(`/products/${categorySlug}/${productSlug}`).then((r) => r.data.data),

  getAdminAll: (limit = 100) =>
    apiInstance
      .get<{ data: Product[] }>(`/products/admin/all?limit=${limit}`)
      .then((r) => (Array.isArray(r.data?.data) ? r.data.data : [])),

  getAdminById: async (id: string): Promise<Product | null> => {
    const list = await productApi.getAdminAll(500)
    return list.find((p) => p.id === id) ?? null
  },

  createAdmin: (payload: AdminProductPayload) =>
    apiInstance.post<{ data: Product }>('/products', payload).then((r) => r.data.data),

  updateAdmin: (id: string, payload: Partial<AdminProductPayload>) =>
    apiInstance.patch<{ data: Product }>(`/products/${id}`, payload).then((r) => r.data.data),

  deleteAdmin: (id: string) => apiInstance.delete(`/products/${id}`),
}
