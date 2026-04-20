import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { OrderOrmEntity } from '../../infrastructure/typeorm/order.orm-entity'
import { CreateOrderDto } from '../dto/create-order.dto'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repo: Repository<OrderOrmEntity>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать заявку' })
  create(@Body() dto: CreateOrderDto) {
    return this.repo.save(this.repo.create(dto))
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Список заявок [Admin]' })
  findAll(@Query('status') status?: string) {
    const where = status ? { status: status as OrderOrmEntity['status'] } : {}
    return this.repo.find({ where, order: { createdAt: 'DESC' } })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статус заявки [Admin]' })
  async update(@Param('id') id: string, @Body() body: Partial<OrderOrmEntity>) {
    await this.repo.update(id, body)
    return this.repo.findOneByOrFail({ id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить заявку [Admin]' })
  async remove(@Param('id') id: string) {
    await this.repo.delete(id)
    return { success: true }
  }
}
