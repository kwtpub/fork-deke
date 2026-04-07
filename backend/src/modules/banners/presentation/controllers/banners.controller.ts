import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { GetActiveBannersUseCase } from '../../application/use-cases/get-active-banners.use-case'
import { BannerOrmEntity } from '../../infrastructure/typeorm/banner.orm-entity'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'
import { CacheService } from '../../../../shared/redis/cache.service'

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(
    private readonly getActiveBanners: GetActiveBannersUseCase,
    @InjectRepository(BannerOrmEntity) private readonly repo: Repository<BannerOrmEntity>,
    private readonly cacheService: CacheService,
  ) {}

  @Get('active')
  @ApiOperation({ summary: 'Активные баннеры' })
  findActive() { return this.getActiveBanners.execute() }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Все баннеры [Admin]' })
  findAll() { return this.repo.find({ order: { sortOrder: 'ASC' } }) }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать баннер [Admin]' })
  async create(@Body() body: Partial<BannerOrmEntity>) {
    const result = await this.repo.save(this.repo.create(body))
    await this.cacheService.delByPattern('banners:')
    return result
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить баннер [Admin]' })
  async update(@Param('id') id: string, @Body() body: Partial<BannerOrmEntity>) {
    await this.repo.update(id, body)
    await this.cacheService.delByPattern('banners:')
    return this.repo.findOneByOrFail({ id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить баннер [Admin]' })
  async remove(@Param('id') id: string) {
    await this.repo.delete(id)
    await this.cacheService.delByPattern('banners:')
  }
}
