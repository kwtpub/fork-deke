import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface'
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface'

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepo: IProductRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(categorySlug: string, productSlug: string) {
    const key = `products:detail:${categorySlug}:${productSlug}`
    const cached = await this.cache.get(key)
    if (cached) return cached
    const product = await this.productRepo.findBySlug(categorySlug, productSlug)
    if (!product) throw new NotFoundException('Продукт не найден')
    await this.cache.set(key, product, 1800_000)
    return product
  }
}
