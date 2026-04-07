import type { Cache } from 'cache-manager';
import type Redis from 'ioredis';
export declare const REDIS_CLIENT = "REDIS_CLIENT";
export declare class CacheService {
    private readonly cache;
    private readonly redis;
    constructor(cache: Cache, redis: Redis);
    del(key: string): Promise<void>;
    delByPattern(pattern: string): Promise<void>;
}
