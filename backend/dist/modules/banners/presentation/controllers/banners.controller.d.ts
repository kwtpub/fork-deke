import type { Repository } from 'typeorm';
import { GetActiveBannersUseCase } from '../../application/use-cases/get-active-banners.use-case';
import { BannerOrmEntity } from '../../infrastructure/typeorm/banner.orm-entity';
import { CacheService } from '../../../../shared/redis/cache.service';
export declare class BannersController {
    private readonly getActiveBanners;
    private readonly repo;
    private readonly cacheService;
    constructor(getActiveBanners: GetActiveBannersUseCase, repo: Repository<BannerOrmEntity>, cacheService: CacheService);
    findActive(): Promise<{}>;
    findAll(): Promise<BannerOrmEntity[]>;
    create(body: Partial<BannerOrmEntity>): Promise<BannerOrmEntity>;
    update(id: string, body: Partial<BannerOrmEntity>): Promise<BannerOrmEntity>;
    remove(id: string): Promise<void>;
}
