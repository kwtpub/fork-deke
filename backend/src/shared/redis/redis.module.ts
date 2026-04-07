import { Global, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createKeyv } from '@keyv/redis'
import { CacheableMemory } from 'cacheable'
import { Keyv } from 'keyv'
import Redis from 'ioredis'
import { CacheService, REDIS_CLIENT } from './cache.service'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('redis.host')
        const port = config.get<number>('redis.port')
        const ttl = config.get<number>('redis.ttl', 3600)
        return {
          stores: [
            new Keyv({ store: new CacheableMemory({ ttl: 60_000, lruSize: 5000 }) }),
            createKeyv(`redis://${host}:${port}`),
          ],
          ttl: ttl * 1000,
        }
      },
    }),
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => new Redis({
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
      }),
    },
    CacheService,
  ],
  exports: [CacheModule, CacheService],
})
export class RedisModule {}
