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
exports.GetNewsListUseCase = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const news_repository_interface_1 = require("../../../domain/repositories/news.repository.interface");
let GetNewsListUseCase = class GetNewsListUseCase {
    newsRepo;
    cache;
    constructor(newsRepo, cache) {
        this.newsRepo = newsRepo;
        this.cache = cache;
    }
    async execute(page = 1, limit = 10) {
        const key = `news:list:${page}`;
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const { data, total } = await this.newsRepo.findPaginated(page, limit);
        const result = { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
        await this.cache.set(key, result, 900_000);
        return result;
    }
};
exports.GetNewsListUseCase = GetNewsListUseCase;
exports.GetNewsListUseCase = GetNewsListUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(news_repository_interface_1.NEWS_REPOSITORY)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object])
], GetNewsListUseCase);
//# sourceMappingURL=get-news-list.use-case.js.map