import { CategoryOrmEntity } from '../../../categories/infrastructure/typeorm/category.orm-entity';
import { ProductSeriesOrmEntity } from './product-series.orm-entity';
export declare class ProductOrmEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    priceFrom: number;
    isActive: boolean;
    isFeatured: boolean;
    specifications: Record<string, string>;
    categoryId: string;
    category: CategoryOrmEntity;
    series: ProductSeriesOrmEntity[];
    createdAt: Date;
    updatedAt: Date;
}
