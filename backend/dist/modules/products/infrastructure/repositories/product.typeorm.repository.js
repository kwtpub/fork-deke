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
exports.ProductTypeormRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_orm_entity_1 = require("../typeorm/product.orm-entity");
let ProductTypeormRepository = class ProductTypeormRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findPaginated({ categorySlug, search, page = 1, limit = 12 }) {
        const qb = this.repo.createQueryBuilder('p')
            .leftJoinAndSelect('p.category', 'category')
            .leftJoinAndSelect('p.series', 'series')
            .where('p.isActive = :active', { active: true });
        if (categorySlug)
            qb.andWhere('category.slug = :slug', { slug: categorySlug });
        if (search)
            qb.andWhere('p.name ILIKE :search', { search: `%${search}%` });
        const total = await qb.clone().getCount();
        const data = await qb.skip((page - 1) * limit).take(limit).getMany();
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    findBySlug(categorySlug, productSlug) {
        return this.repo.createQueryBuilder('p')
            .leftJoinAndSelect('p.category', 'category')
            .leftJoinAndSelect('p.series', 'series')
            .leftJoinAndSelect('series.colors', 'colors')
            .where('p.slug = :slug', { slug: productSlug })
            .andWhere('category.slug = :categorySlug', { categorySlug })
            .getOne();
    }
    findFeatured(limit = 8) {
        return this.repo.find({
            where: { isFeatured: true, isActive: true },
            relations: ['category', 'series'],
            take: limit,
        });
    }
};
exports.ProductTypeormRepository = ProductTypeormRepository;
exports.ProductTypeormRepository = ProductTypeormRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_orm_entity_1.ProductOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductTypeormRepository);
//# sourceMappingURL=product.typeorm.repository.js.map