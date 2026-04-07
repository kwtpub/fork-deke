import { ProductSeriesOrmEntity } from './product-series.orm-entity';
export declare class ProductColorOrmEntity {
    id: string;
    name: string;
    hex: string;
    image: string;
    seriesId: string;
    series: ProductSeriesOrmEntity;
}
