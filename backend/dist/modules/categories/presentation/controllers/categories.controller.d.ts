import type { Repository } from 'typeorm';
import { GetCategoriesTreeUseCase } from '../../application/use-cases/get-categories-tree/get-categories-tree.use-case';
import { GetCategoryBySlugUseCase } from '../../application/use-cases/get-category-by-slug/get-category-by-slug.use-case';
import { CategoryOrmEntity } from '../../infrastructure/typeorm/category.orm-entity';
import { CacheService } from '../../../../shared/redis/cache.service';
export declare class CategoriesController {
    private readonly getCategoriesTree;
    private readonly getCategoryBySlug;
    private readonly repo;
    private readonly cacheService;
    constructor(getCategoriesTree: GetCategoriesTreeUseCase, getCategoryBySlug: GetCategoryBySlugUseCase, repo: Repository<CategoryOrmEntity>, cacheService: CacheService);
    findAll(): Promise<{}>;
    findOne(slug: string): Promise<CategoryOrmEntity>;
    create(body: Partial<CategoryOrmEntity>): Promise<CategoryOrmEntity>;
    update(id: string, body: Partial<CategoryOrmEntity>): Promise<CategoryOrmEntity>;
    remove(id: string): Promise<void>;
}
