import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { BannerOrmEntity } from './infrastructure/typeorm/banner.orm-entity'
import { GetActiveBannersUseCase } from './application/use-cases/get-active-banners.use-case'
import { BannersController } from './presentation/controllers/banners.controller'

@Module({
  imports: [TypeOrmModule.forFeature([BannerOrmEntity]), AuthModule],
  controllers: [BannersController],
  providers: [GetActiveBannersUseCase],
})
export class BannersModule {}
