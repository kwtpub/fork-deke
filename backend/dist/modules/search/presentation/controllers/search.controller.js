"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SearchController = class SearchController {
    dataSource;
    cache;
    constructor(dataSource, cache) {
        this.dataSource = dataSource;
        this.cache = cache;
    }
    async search(query) {
        if (!query || query.trim().length < 2)
            return { products: [], news: [] };
        const key = `search:${query.toLowerCase().trim()}`;
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const q = `%${query}%`;
        const [products, news] = await Promise.all([
            this.dataSource.query(`SELECT id, name, slug, "categoryId" FROM products WHERE name ILIKE $1 AND "isActive" = true LIMIT 10`, [q]),
            this.dataSource.query(`SELECT id, title, slug, excerpt FROM news WHERE title ILIKE $1 AND "isPublished" = true LIMIT 5`, [q]),
        ]);
        const result = { products, news };
        await this.cache.set(key, result, 300_000);
        return result;
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Полнотекстовый поиск' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Поисковый запрос' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.DataSource, Object])
], SearchController);
//# sourceMappingURL=search.controller.js.map