import type { INewsRepository } from '../../../domain/repositories/news.repository.interface';
export declare class GetNewsBySlugUseCase {
    private readonly newsRepo;
    constructor(newsRepo: INewsRepository);
    execute(slug: string): Promise<import("../../../infrastructure/typeorm/news.orm-entity").NewsOrmEntity>;
}
