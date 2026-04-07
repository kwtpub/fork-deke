import { Repository } from 'typeorm';
import { CategoryOrmEntity } from '../typeorm/category.orm-entity';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
export declare class CategoryTypeormRepository implements ICategoryRepository {
    private readonly repo;
    constructor(repo: Repository<CategoryOrmEntity>);
    findTree(): Promise<CategoryOrmEntity[]>;
    findBySlug(slug: string): Promise<CategoryOrmEntity | null>;
    findAll(): Promise<CategoryOrmEntity[]>;
}
