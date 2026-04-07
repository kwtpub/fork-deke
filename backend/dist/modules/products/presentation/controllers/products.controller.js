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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const get_products_list_use_case_1 = require("../../application/use-cases/get-products-list/get-products-list.use-case");
const get_product_by_slug_use_case_1 = require("../../application/use-cases/get-product-by-slug/get-product-by-slug.use-case");
const product_orm_entity_1 = require("../../infrastructure/typeorm/product.orm-entity");
const jwt_auth_guard_1 = require("../../../auth/infrastructure/guards/jwt-auth.guard");
const cache_service_1 = require("../../../../shared/redis/cache.service");
let ProductsController = class ProductsController {
    getProductsList;
    getProductBySlug;
    productRepo;
    cacheService;
    constructor(getProductsList, getProductBySlug, productRepo, cacheService) {
        this.getProductsList = getProductsList;
        this.getProductBySlug = getProductBySlug;
        this.productRepo = productRepo;
        this.cacheService = cacheService;
    }
    findAll(categorySlug, search, page, limit) {
        return this.getProductsList.execute({
            categorySlug,
            search,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 12,
        });
    }
    async findAllAdmin(limit, page) {
        const result = await this.productRepo.find({
            relations: ['category'],
            order: { createdAt: 'DESC' },
            take: limit ? parseInt(limit, 10) : 100,
            skip: page ? (parseInt(page, 10) - 1) * (limit ? parseInt(limit, 10) : 100) : 0,
        });
        return result;
    }
    findOne(categorySlug, slug) {
        return this.getProductBySlug.execute(categorySlug, slug);
    }
    async create(body) {
        const product = this.productRepo.create(body);
        const result = await this.productRepo.save(product);
        await this.cacheService.delByPattern('products:list');
        return result;
    }
    async update(id, body) {
        await this.productRepo.update(id, body);
        await this.cacheService.delByPattern('products:list');
        return this.productRepo.findOneByOrFail({ id });
    }
    async remove(id) {
        await this.productRepo.delete(id);
        await this.cacheService.delByPattern('products:list');
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Список продуктов с фильтрацией' }),
    (0, swagger_1.ApiQuery)({ name: 'categorySlug', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('categorySlug')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Все продукты без кеша [Admin]' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)(':categorySlug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Продукт по slug' }),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Создать продукт [Admin]' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить продукт [Admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить продукт [Admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __param(2, (0, typeorm_1.InjectRepository)(product_orm_entity_1.ProductOrmEntity)),
    __metadata("design:paramtypes", [get_products_list_use_case_1.GetProductsListUseCase,
        get_product_by_slug_use_case_1.GetProductBySlugUseCase, Function, cache_service_1.CacheService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map