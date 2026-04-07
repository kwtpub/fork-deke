export interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
}
