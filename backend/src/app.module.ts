import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { DatabaseModule } from './shared/database/database.module'
import { RedisModule } from './shared/redis/redis.module'
import { S3Module } from './shared/s3/s3.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { ProductsModule } from './modules/products/products.module'
import { NewsModule } from './modules/news/news.module'
import { BannersModule } from './modules/banners/banners.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { CalculatorModule } from './modules/calculator/calculator.module'
import { SearchModule } from './modules/search/search.module'
import { OrdersModule } from './modules/orders/orders.module'
import { AuthModule } from './modules/auth/auth.module'
import { UploadModule } from './modules/upload/upload.module'
import appConfig from './config/app.config'
import databaseConfig from './config/database.config'
import redisConfig from './config/redis.config'
import jwtConfig from './config/jwt.config'
import awsConfig from './config/aws.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig, awsConfig],
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 60 }] }),
    DatabaseModule,
    RedisModule,
    S3Module,
    CategoriesModule,
    ProductsModule,
    NewsModule,
    BannersModule,
    DocumentsModule,
    CalculatorModule,
    SearchModule,
    OrdersModule,
    AuthModule,
    UploadModule,
  ],
})
export class AppModule {}
