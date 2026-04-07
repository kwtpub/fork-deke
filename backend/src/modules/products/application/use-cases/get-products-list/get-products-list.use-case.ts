import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface'
import type { IProductRepository, ProductListParams } from '../../../domain/repositories/product.repository.interface'

@Injectable()
export class GetProductsListUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepo: IProductRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(params: ProductListParams) {
    const key = `products:list:${params.categorySlug ?? 'all'}:${params.page ?? 1}:${params.search ?? ''}`
    const cached = await this.cache.get(key)
    if (cached) return cached
    const result = await this.productRepo.findPaginated(params)
    await this.cache.set(key, result, 600_000)
    return result
  }
}
