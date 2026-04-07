import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { BannerOrmEntity } from '../../infrastructure/typeorm/banner.orm-entity'

@Injectable()
export class GetActiveBannersUseCase {
  constructor(
    @InjectRepository(BannerOrmEntity) private readonly repo: Repository<BannerOrmEntity>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute() {
    const key = 'banners:active'
    const cached = await this.cache.get(key)
    if (cached) return cached
    const banners = await this.repo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } })
    await this.cache.set(key, banners, 3600_000)
    return banners
  }
}
