import { apiInstance } from '@shared/api/baseApi'
import type { PaginatedResponse } from '@shared/api/apiTypes'
import type { Product, ProductListParams } from '../model/productTypes'

export const productApi = {
  getList: (params: ProductListParams) =>
    apiInstance.get<{ data: PaginatedResponse<Product> }>('/products', { params }).then((r) => r.data.data),

  getBySlug: (categorySlug: string, productSlug: string) =>
    apiInstance.get<{ data: { data: Product } }>(`/products/${categorySlug}/${productSlug}`).then((r) => r.data.data.data),
}
