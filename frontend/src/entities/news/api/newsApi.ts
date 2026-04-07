import { apiInstance } from '@shared/api/baseApi'
import type { PaginatedResponse } from '@shared/api/apiTypes'
import type { News } from '../model/newsTypes'

export const newsApi = {
  getList: (params?: { page?: number; limit?: number }) =>
    apiInstance.get<{ data: PaginatedResponse<News> }>('/news', { params }).then((r) => r.data.data),
  getBySlug: (slug: string) =>
    apiInstance.get<{ data: { data: News } }>(`/news/${slug}`).then((r) => r.data.data.data),
}
