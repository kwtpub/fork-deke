import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { CATEGORY_REPOSITORY } from '../../../domain/repositories/category.repository.interface'
import type { ICategoryRepository } from '../../../domain/repositories/category.repository.interface'

@Injectable()
export class GetCategoriesTreeUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async execute() {
    const cacheKey = 'categories:tree'
    const cached = await this.cache.get(cacheKey)
    if (cached) return cached
    const result = await this.categoryRepo.findTree()
    await this.cache.set(cacheKey, result, 3600_000)
    return result
  }
}
