import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { CategoryOrmEntity } from './infrastructure/typeorm/category.orm-entity'
import { CategoryTypeormRepository } from './infrastructure/repositories/category.typeorm.repository'
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface'
import { GetCategoriesTreeUseCase } from './application/use-cases/get-categories-tree/get-categories-tree.use-case'
import { GetCategoryBySlugUseCase } from './application/use-cases/get-category-by-slug/get-category-by-slug.use-case'
import { CategoriesController } from './presentation/controllers/categories.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity]), AuthModule],
  controllers: [CategoriesController],
  providers: [
    GetCategoriesTreeUseCase,
    GetCategoryBySlugUseCase,
    { provide: CATEGORY_REPOSITORY, useClass: CategoryTypeormRepository },
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoriesModule {}
