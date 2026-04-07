import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { ProductOrmEntity } from './infrastructure/typeorm/product.orm-entity'
import { ProductSeriesOrmEntity } from './infrastructure/typeorm/product-series.orm-entity'
import { ProductColorOrmEntity } from './infrastructure/typeorm/product-color.orm-entity'
import { ProductTypeormRepository } from './infrastructure/repositories/product.typeorm.repository'
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface'
import { GetProductsListUseCase } from './application/use-cases/get-products-list/get-products-list.use-case'
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug/get-product-by-slug.use-case'
import { ProductsController } from './presentation/controllers/products.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity, ProductSeriesOrmEntity, ProductColorOrmEntity]), AuthModule],
  controllers: [ProductsController],
  providers: [
    GetProductsListUseCase,
    GetProductBySlugUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: ProductTypeormRepository },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
