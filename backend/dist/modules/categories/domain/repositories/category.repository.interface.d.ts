import type { CategoryOrmEntity } from '../../infrastructure/typeorm/category.orm-entity';
export declare const CATEGORY_REPOSITORY: unique symbol;
export interface ICategoryRepository {
    findTree(): Promise<CategoryOrmEntity[]>;
    findBySlug(slug: string): Promise<CategoryOrmEntity | null>;
    findAll(): Promise<CategoryOrmEntity[]>;
}
