import type { Cache } from 'cache-manager';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
export declare class GetProductBySlugUseCase {
    private readonly productRepo;
    private readonly cache;
    constructor(productRepo: IProductRepository, cache: Cache);
    execute(categorySlug: string, productSlug: string): Promise<{}>;
}
