import type { ProductOrmEntity } from '../../infrastructure/typeorm/product.orm-entity'

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY')

export interface ProductListParams {
  categorySlug?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedProducts {
  data: ProductOrmEntity[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface IProductRepository {
  findPaginated(params: ProductListParams): Promise<PaginatedProducts>
  findBySlug(categorySlug: string, productSlug: string): Promise<ProductOrmEntity | null>
  findFeatured(limit?: number): Promise<ProductOrmEntity[]>
}
