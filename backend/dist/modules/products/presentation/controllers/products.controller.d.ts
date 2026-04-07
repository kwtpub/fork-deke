import type { Repository } from 'typeorm';
import { GetProductsListUseCase } from '../../application/use-cases/get-products-list/get-products-list.use-case';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug/get-product-by-slug.use-case';
import { ProductOrmEntity } from '../../infrastructure/typeorm/product.orm-entity';
import { CacheService } from '../../../../shared/redis/cache.service';
export declare class ProductsController {
    private readonly getProductsList;
    private readonly getProductBySlug;
    private readonly productRepo;
    private readonly cacheService;
    constructor(getProductsList: GetProductsListUseCase, getProductBySlug: GetProductBySlugUseCase, productRepo: Repository<ProductOrmEntity>, cacheService: CacheService);
    findAll(categorySlug?: string, search?: string, page?: string, limit?: string): Promise<{}>;
    findAllAdmin(limit?: string, page?: string): Promise<ProductOrmEntity[]>;
    findOne(categorySlug: string, slug: string): Promise<{}>;
    create(body: Partial<ProductOrmEntity>): Promise<ProductOrmEntity>;
    update(id: string, body: Partial<ProductOrmEntity>): Promise<ProductOrmEntity>;
    remove(id: string): Promise<void>;
}
