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
exports.BannersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const get_active_banners_use_case_1 = require("../../application/use-cases/get-active-banners.use-case");
const banner_orm_entity_1 = require("../../infrastructure/typeorm/banner.orm-entity");
const jwt_auth_guard_1 = require("../../../auth/infrastructure/guards/jwt-auth.guard");
const cache_service_1 = require("../../../../shared/redis/cache.service");
let BannersController = class BannersController {
    getActiveBanners;
    repo;
    cacheService;
    constructor(getActiveBanners, repo, cacheService) {
        this.getActiveBanners = getActiveBanners;
        this.repo = repo;
        this.cacheService = cacheService;
    }
    findActive() { return this.getActiveBanners.execute(); }
    findAll() { return this.repo.find({ order: { sortOrder: 'ASC' } }); }
    async create(body) {
        const result = await this.repo.save(this.repo.create(body));
        await this.cacheService.delByPattern('banners:');
        return result;
    }
    async update(id, body) {
        await this.repo.update(id, body);
        await this.cacheService.delByPattern('banners:');
        return this.repo.findOneByOrFail({ id });
    }
    async remove(id) {
        await this.repo.delete(id);
        await this.cacheService.delByPattern('banners:');
    }
};
exports.BannersController = BannersController;
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Активные баннеры' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Все баннеры [Admin]' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать баннер [Admin]' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить баннер [Admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить баннер [Admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "remove", null);
exports.BannersController = BannersController = __decorate([
    (0, swagger_1.ApiTags)('Banners'),
    (0, common_1.Controller)('banners'),
    __param(1, (0, typeorm_1.InjectRepository)(banner_orm_entity_1.BannerOrmEntity)),
    __metadata("design:paramtypes", [get_active_banners_use_case_1.GetActiveBannersUseCase, Function, cache_service_1.CacheService])
], BannersController);
//# sourceMappingURL=banners.controller.js.map