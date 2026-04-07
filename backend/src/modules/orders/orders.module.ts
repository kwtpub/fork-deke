import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { OrderOrmEntity } from './infrastructure/typeorm/order.orm-entity'
import { OrdersController } from './presentation/controllers/orders.controller'

@Module({
  imports: [TypeOrmModule.forFeature([OrderOrmEntity]), AuthModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
