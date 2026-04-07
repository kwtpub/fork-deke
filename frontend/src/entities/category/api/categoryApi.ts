import { apiInstance } from '@shared/api/baseApi'
import type { Category } from '../model/categoryTypes'

export const categoryApi = {
  getTree: () =>
    apiInstance.get<{ data: Category[] }>('/categories').then((r) => r.data.data),
  getBySlug: (slug: string) =>
    apiInstance.get<{ data: Category }>(`/categories/${slug}`).then((r) => r.data.data),
}
