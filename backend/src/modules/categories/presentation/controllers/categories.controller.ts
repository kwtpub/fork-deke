import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { GetCategoriesTreeUseCase } from '../../application/use-cases/get-categories-tree/get-categories-tree.use-case'
import { GetCategoryBySlugUseCase } from '../../application/use-cases/get-category-by-slug/get-category-by-slug.use-case'
import { CategoryOrmEntity } from '../../infrastructure/typeorm/category.orm-entity'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'
import { CacheService } from '../../../../shared/redis/cache.service'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly getCategoriesTree: GetCategoriesTreeUseCase,
    private readonly getCategoryBySlug: GetCategoryBySlugUseCase,
    @InjectRepository(CategoryOrmEntity) private readonly repo: Repository<CategoryOrmEntity>,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить дерево категорий' })
  findAll() { return this.getCategoriesTree.execute() }

  @Get(':slug')
  @ApiOperation({ summary: 'Получить категорию по slug' })
  findOne(@Param('slug') slug: string) { return this.getCategoryBySlug.execute(slug) }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать категорию [Admin]' })
  async create(@Body() body: Partial<CategoryOrmEntity>) {
    const result = await this.repo.save(this.repo.create(body))
    await this.cacheService.del('categories:tree')
    return result
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить категорию [Admin]' })
  async update(@Param('id') id: string, @Body() body: Partial<CategoryOrmEntity>) {
    await this.repo.update(id, body)
    await this.cacheService.del('categories:tree')
    return this.repo.findOneByOrFail({ id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить категорию [Admin]' })
  async remove(@Param('id') id: string) {
    await this.repo.delete(id)
    await this.cacheService.del('categories:tree')
  }
}
