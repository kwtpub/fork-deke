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
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const get_news_list_use_case_1 = require("../../application/use-cases/get-news-list/get-news-list.use-case");
const get_news_by_slug_use_case_1 = require("../../application/use-cases/get-news-by-slug/get-news-by-slug.use-case");
const news_orm_entity_1 = require("../../infrastructure/typeorm/news.orm-entity");
const jwt_auth_guard_1 = require("../../../auth/infrastructure/guards/jwt-auth.guard");
const cache_service_1 = require("../../../../shared/redis/cache.service");
let NewsController = class NewsController {
    getNewsList;
    getNewsBySlug;
    newsRepo;
    cacheService;
    constructor(getNewsList, getNewsBySlug, newsRepo, cacheService) {
        this.getNewsList = getNewsList;
        this.getNewsBySlug = getNewsBySlug;
        this.newsRepo = newsRepo;
        this.cacheService = cacheService;
    }
    findAll(page, limit) {
        return this.getNewsList.execute(page ? +page : 1, limit ? +limit : 10);
    }
    findOne(slug) { return this.getNewsBySlug.execute(slug); }
    async create(body) {
        const result = await this.newsRepo.save(this.newsRepo.create({ ...body, publishedAt: body.isPublished ? new Date() : undefined }));
        await this.cacheService.delByPattern('news:list');
        return result;
    }
    async update(id, body) {
        await this.newsRepo.update(id, body);
        await this.cacheService.delByPattern('news:list');
        return this.newsRepo.findOneByOrFail({ id });
    }
    async remove(id) {
        await this.newsRepo.delete(id);
        await this.cacheService.delByPattern('news:list');
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Список новостей' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Новость по slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новость [Admin]' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить новость [Admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить новость [Admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "remove", null);
exports.NewsController = NewsController = __decorate([
    (0, swagger_1.ApiTags)('News'),
    (0, common_1.Controller)('news'),
    __param(2, (0, typeorm_1.InjectRepository)(news_orm_entity_1.NewsOrmEntity)),
    __metadata("design:paramtypes", [get_news_list_use_case_1.GetNewsListUseCase,
        get_news_by_slug_use_case_1.GetNewsBySlugUseCase, Function, cache_service_1.CacheService])
], NewsController);
//# sourceMappingURL=news.controller.js.map