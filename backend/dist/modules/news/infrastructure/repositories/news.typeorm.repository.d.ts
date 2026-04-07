import { Repository } from 'typeorm';
import { NewsOrmEntity } from '../typeorm/news.orm-entity';
import type { INewsRepository } from '../../domain/repositories/news.repository.interface';
export declare class NewsTypeormRepository implements INewsRepository {
    private readonly repo;
    constructor(repo: Repository<NewsOrmEntity>);
    findPaginated(page: number, limit: number): Promise<{
        data: NewsOrmEntity[];
        total: number;
    }>;
    findBySlug(slug: string): Promise<NewsOrmEntity | null>;
}
