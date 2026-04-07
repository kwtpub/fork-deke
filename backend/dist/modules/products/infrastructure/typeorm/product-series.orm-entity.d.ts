import { ProductOrmEntity } from './product.orm-entity';
import { ProductColorOrmEntity } from './product-color.orm-entity';
export declare class ProductSeriesOrmEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    specs: Array<{
        key: string;
        label: string;
        value: string;
        unit?: string;
    }>;
    productId: string;
    product: ProductOrmEntity;
    colors: ProductColorOrmEntity[];
}
