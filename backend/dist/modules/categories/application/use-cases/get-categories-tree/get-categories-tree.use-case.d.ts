import type { Cache } from 'cache-manager';
import type { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
export declare class GetCategoriesTreeUseCase {
    private readonly categoryRepo;
    private readonly cache;
    constructor(categoryRepo: ICategoryRepository, cache: Cache);
    execute(): Promise<{}>;
}
