import type { CategoryOrmEntity } from '../../infrastructure/typeorm/category.orm-entity'

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY')

export interface ICategoryRepository {
  findTree(): Promise<CategoryOrmEntity[]>
  findBySlug(slug: string): Promise<CategoryOrmEntity | null>
  findAll(): Promise<CategoryOrmEntity[]>
}
