export interface ProductColor {
  id: string
  name: string
  hex: string
  image?: string
}

export interface ProductSpec {
  key: string
  label: string
  value: string
  unit?: string
}

export interface ProductSeries {
  id: string
  name: string
  slug: string
  description?: string
  coverImage?: string
  colors: ProductColor[]
  specs: ProductSpec[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  images: string[]
  priceFrom?: number
  isActive: boolean
  isFeatured: boolean
  categoryId: string
  categorySlug: string
  category?: {
    id: string
    name: string
    slug: string
  }
  series: ProductSeries[]
  specifications: Record<string, string>
  createdAt: string
}

export interface ProductListParams {
  categorySlug?: string
  page?: number
  limit?: number
  search?: string
  seriesId?: string
}
