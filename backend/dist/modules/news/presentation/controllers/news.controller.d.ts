import type { Repository } from 'typeorm';
import { GetNewsListUseCase } from '../../application/use-cases/get-news-list/get-news-list.use-case';
import { GetNewsBySlugUseCase } from '../../application/use-cases/get-news-by-slug/get-news-by-slug.use-case';
import { NewsOrmEntity } from '../../infrastructure/typeorm/news.orm-entity';
import { CacheService } from '../../../../shared/redis/cache.service';
export declare class NewsController {
    private readonly getNewsList;
    private readonly getNewsBySlug;
    private readonly newsRepo;
    private readonly cacheService;
    constructor(getNewsList: GetNewsListUseCase, getNewsBySlug: GetNewsBySlugUseCase, newsRepo: Repository<NewsOrmEntity>, cacheService: CacheService);
    findAll(page?: string, limit?: string): Promise<{}>;
    findOne(slug: string): Promise<NewsOrmEntity>;
    create(body: Partial<NewsOrmEntity>): Promise<NewsOrmEntity>;
    update(id: string, body: Partial<NewsOrmEntity>): Promise<NewsOrmEntity>;
    remove(id: string): Promise<void>;
}
