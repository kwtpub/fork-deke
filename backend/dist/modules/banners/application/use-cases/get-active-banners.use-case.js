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
exports.GetActiveBannersUseCase = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const banner_orm_entity_1 = require("../../infrastructure/typeorm/banner.orm-entity");
let GetActiveBannersUseCase = class GetActiveBannersUseCase {
    repo;
    cache;
    constructor(repo, cache) {
        this.repo = repo;
        this.cache = cache;
    }
    async execute() {
        const key = 'banners:active';
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const banners = await this.repo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
        await this.cache.set(key, banners, 3600_000);
        return banners;
    }
};
exports.GetActiveBannersUseCase = GetActiveBannersUseCase;
exports.GetActiveBannersUseCase = GetActiveBannersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_orm_entity_1.BannerOrmEntity)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], GetActiveBannersUseCase);
//# sourceMappingURL=get-active-banners.use-case.js.map