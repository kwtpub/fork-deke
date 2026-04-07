import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import type Redis from 'ioredis'

export const REDIS_CLIENT = 'REDIS_CLIENT'

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async del(key: string): Promise<void> {
    await this.cache.del(key)
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(`*${pattern}*`)
    if (keys.length > 0) await this.redis.del(...keys)
  }
}
