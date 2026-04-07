import type { Cache } from 'cache-manager';
import type { INewsRepository } from '../../../domain/repositories/news.repository.interface';
export declare class GetNewsListUseCase {
    private readonly newsRepo;
    private readonly cache;
    constructor(newsRepo: INewsRepository, cache: Cache);
    execute(page?: number, limit?: number): Promise<{}>;
}
