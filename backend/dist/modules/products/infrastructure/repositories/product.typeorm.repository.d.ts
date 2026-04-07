import { Repository } from 'typeorm';
import { ProductOrmEntity } from '../typeorm/product.orm-entity';
import type { IProductRepository, ProductListParams, PaginatedProducts } from '../../domain/repositories/product.repository.interface';
export declare class ProductTypeormRepository implements IProductRepository {
    private readonly repo;
    constructor(repo: Repository<ProductOrmEntity>);
    findPaginated({ categorySlug, search, page, limit }: ProductListParams): Promise<PaginatedProducts>;
    findBySlug(categorySlug: string, productSlug: string): Promise<ProductOrmEntity | null>;
    findFeatured(limit?: number): Promise<ProductOrmEntity[]>;
}
