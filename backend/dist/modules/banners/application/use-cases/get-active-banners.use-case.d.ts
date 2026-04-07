import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { BannerOrmEntity } from '../../infrastructure/typeorm/banner.orm-entity';
export declare class GetActiveBannersUseCase {
    private readonly repo;
    private readonly cache;
    constructor(repo: Repository<BannerOrmEntity>, cache: Cache);
    execute(): Promise<{}>;
}
