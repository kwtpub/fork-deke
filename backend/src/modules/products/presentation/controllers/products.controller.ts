import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { GetProductsListUseCase } from '../../application/use-cases/get-products-list/get-products-list.use-case'
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug/get-product-by-slug.use-case'
import { ProductOrmEntity } from '../../infrastructure/typeorm/product.orm-entity'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'
import { CacheService } from '../../../../shared/redis/cache.service'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsList: GetProductsListUseCase,
    private readonly getProductBySlug: GetProductBySlugUseCase,
    @InjectRepository(ProductOrmEntity) private readonly productRepo: Repository<ProductOrmEntity>,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список продуктов с фильтрацией' })
  @ApiQuery({ name: 'categorySlug', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('categorySlug') categorySlug?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.getProductsList.execute({
      categorySlug,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 12,
    })
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Все продукты без кеша [Admin]' })
  async findAllAdmin(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const result = await this.productRepo.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit ? parseInt(limit, 10) : 100,
      skip: page ? (parseInt(page, 10) - 1) * (limit ? parseInt(limit, 10) : 100) : 0,
    })
    return result
  }

  @Get(':categorySlug/:slug')
  @ApiOperation({ summary: 'Продукт по slug' })
  findOne(@Param('categorySlug') categorySlug: string, @Param('slug') slug: string) {
    return this.getProductBySlug.execute(categorySlug, slug)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать продукт [Admin]' })
  async create(@Body() body: Partial<ProductOrmEntity>) {
    const product = this.productRepo.create(body)
    const result = await this.productRepo.save(product)
    await this.cacheService.delByPattern('products:list')
    return result
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить продукт [Admin]' })
  async update(@Param('id') id: string, @Body() body: Partial<ProductOrmEntity>) {
    await this.productRepo.update(id, body)
    await this.cacheService.delByPattern('products:list')
    return this.productRepo.findOneByOrFail({ id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить продукт [Admin]' })
  async remove(@Param('id') id: string) {
    await this.productRepo.delete(id)
    await this.cacheService.delByPattern('products:list')
  }
}
