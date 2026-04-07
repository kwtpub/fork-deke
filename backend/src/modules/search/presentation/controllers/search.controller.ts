import { Controller, Get, Query, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Полнотекстовый поиск' })
  @ApiQuery({ name: 'q', description: 'Поисковый запрос' })
  async search(@Query('q') query: string) {
    if (!query || query.trim().length < 2) return { products: [], news: [] }

    const key = `search:${query.toLowerCase().trim()}`
    const cached = await this.cache.get(key)
    if (cached) return cached

    const q = `%${query}%`
    const [products, news] = await Promise.all([
      this.dataSource.query(
        `SELECT id, name, slug, "categoryId" FROM products WHERE name ILIKE $1 AND "isActive" = true LIMIT 10`,
        [q],
      ),
      this.dataSource.query(
        `SELECT id, title, slug, excerpt FROM news WHERE title ILIKE $1 AND "isPublished" = true LIMIT 5`,
        [q],
      ),
    ])

    const result = { products, news }
    await this.cache.set(key, result, 300_000) // 5 min
    return result
  }
}
