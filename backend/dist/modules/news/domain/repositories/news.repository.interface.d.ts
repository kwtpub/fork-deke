import type { NewsOrmEntity } from '../../infrastructure/typeorm/news.orm-entity';
export declare const NEWS_REPOSITORY: unique symbol;
export interface INewsRepository {
    findPaginated(page: number, limit: number): Promise<{
        data: NewsOrmEntity[];
        total: number;
    }>;
    findBySlug(slug: string): Promise<NewsOrmEntity | null>;
}
