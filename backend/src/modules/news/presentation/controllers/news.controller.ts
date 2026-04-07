import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { GetNewsListUseCase } from '../../application/use-cases/get-news-list/get-news-list.use-case'
import { GetNewsBySlugUseCase } from '../../application/use-cases/get-news-by-slug/get-news-by-slug.use-case'
import { NewsOrmEntity } from '../../infrastructure/typeorm/news.orm-entity'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'
import { CacheService } from '../../../../shared/redis/cache.service'

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly getNewsList: GetNewsListUseCase,
    private readonly getNewsBySlug: GetNewsBySlugUseCase,
    @InjectRepository(NewsOrmEntity) private readonly newsRepo: Repository<NewsOrmEntity>,
    private readonly cacheService: CacheService,
  ) {}

  @Get() @ApiOperation({ summary: 'Список новостей' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.getNewsList.execute(page ? +page : 1, limit ? +limit : 10)
  }

  @Get(':slug') @ApiOperation({ summary: 'Новость по slug' })
  findOne(@Param('slug') slug: string) { return this.getNewsBySlug.execute(slug) }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новость [Admin]' })
  async create(@Body() body: Partial<NewsOrmEntity>) {
    const result = await this.newsRepo.save(this.newsRepo.create({ ...body, publishedAt: body.isPublished ? new Date() : undefined }))
    await this.cacheService.delByPattern('news:list')
    return result
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить новость [Admin]' })
  async update(@Param('id') id: string, @Body() body: Partial<NewsOrmEntity>) {
    await this.newsRepo.update(id, body)
    await this.cacheService.delByPattern('news:list')
    return this.newsRepo.findOneByOrFail({ id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить новость [Admin]' })
  async remove(@Param('id') id: string) {
    await this.newsRepo.delete(id)
    await this.cacheService.delByPattern('news:list')
  }
}
