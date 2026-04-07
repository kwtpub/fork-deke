import type { Cache } from 'cache-manager';
import { DataSource } from 'typeorm';
export declare class SearchController {
    private readonly dataSource;
    private readonly cache;
    constructor(dataSource: DataSource, cache: Cache);
    search(query: string): Promise<{}>;
}
