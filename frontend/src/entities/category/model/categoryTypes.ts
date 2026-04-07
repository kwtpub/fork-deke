export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  sortOrder: number
  parentId?: string
  children?: Category[]
  productsCount?: number
}
