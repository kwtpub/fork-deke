import { apiInstance } from '@shared/api/baseApi'
import type { Banner } from '../model/bannerTypes'

export const bannerApi = {
  getActive: () =>
    apiInstance.get<{ data: Banner[] }>('/banners/active').then((r) => r.data.data),
}
