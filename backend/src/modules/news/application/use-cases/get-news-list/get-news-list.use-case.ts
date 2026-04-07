import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { NEWS_REPOSITORY } from '../../../domain/repositories/news.repository.interface'
import type { INewsRepository } from '../../../domain/repositories/news.repository.interface'

@Injectable()
export class GetNewsListUseCase {
  constructor(
    @Inject(NEWS_REPOSITORY) private readonly newsRepo: INewsRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(page = 1, limit = 10) {
    const key = `news:list:${page}`
    const cached = await this.cache.get(key)
    if (cached) return cached
    const { data, total } = await this.newsRepo.findPaginated(page, limit)
    const result = { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    await this.cache.set(key, result, 900_000)
    return result
  }
}
