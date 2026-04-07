import type { Cache } from 'cache-manager';
import type { IProductRepository, ProductListParams } from '../../../domain/repositories/product.repository.interface';
export declare class GetProductsListUseCase {
    private readonly productRepo;
    private readonly cache;
    constructor(productRepo: IProductRepository, cache: Cache);
    execute(params: ProductListParams): Promise<{}>;
}
