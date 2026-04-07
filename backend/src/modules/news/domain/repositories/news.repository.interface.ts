import type { NewsOrmEntity } from '../../infrastructure/typeorm/news.orm-entity'
export const NEWS_REPOSITORY = Symbol('NEWS_REPOSITORY')
export interface INewsRepository {
  findPaginated(page: number, limit: number): Promise<{ data: NewsOrmEntity[]; total: number }>
  findBySlug(slug: string): Promise<NewsOrmEntity | null>
}
