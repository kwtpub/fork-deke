import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { NewsOrmEntity } from './infrastructure/typeorm/news.orm-entity'
import { NewsTypeormRepository } from './infrastructure/repositories/news.typeorm.repository'
import { NEWS_REPOSITORY } from './domain/repositories/news.repository.interface'
import { GetNewsListUseCase } from './application/use-cases/get-news-list/get-news-list.use-case'
import { GetNewsBySlugUseCase } from './application/use-cases/get-news-by-slug/get-news-by-slug.use-case'
import { NewsController } from './presentation/controllers/news.controller'

@Module({
  imports: [TypeOrmModule.forFeature([NewsOrmEntity]), AuthModule],
  controllers: [NewsController],
  providers: [
    GetNewsListUseCase, GetNewsBySlugUseCase,
    { provide: NEWS_REPOSITORY, useClass: NewsTypeormRepository },
  ],
})
export class NewsModule {}
