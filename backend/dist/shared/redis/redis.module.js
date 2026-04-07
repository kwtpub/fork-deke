"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const redis_1 = require("@keyv/redis");
const cacheable_1 = require("cacheable");
const keyv_1 = require("keyv");
const ioredis_1 = __importDefault(require("ioredis"));
const cache_service_1 = require("./cache.service");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                isGlobal: true,
                useFactory: async (config) => {
                    const host = config.get('redis.host');
                    const port = config.get('redis.port');
                    const ttl = config.get('redis.ttl', 3600);
                    return {
                        stores: [
                            new keyv_1.Keyv({ store: new cacheable_1.CacheableMemory({ ttl: 60_000, lruSize: 5000 }) }),
                            (0, redis_1.createKeyv)(`redis://${host}:${port}`),
                        ],
                        ttl: ttl * 1000,
                    };
                },
            }),
        ],
        providers: [
            {
                provide: cache_service_1.REDIS_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (config) => new ioredis_1.default({
                    host: config.get('redis.host'),
                    port: config.get('redis.port'),
                }),
            },
            cache_service_1.CacheService,
        ],
        exports: [cache_manager_1.CacheModule, cache_service_1.CacheService],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map