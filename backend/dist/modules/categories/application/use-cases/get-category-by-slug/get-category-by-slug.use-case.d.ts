import type { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
export declare class GetCategoryBySlugUseCase {
    private readonly categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(slug: string): Promise<import("../../../infrastructure/typeorm/category.orm-entity").CategoryOrmEntity>;
}
