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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const category_orm_entity_1 = require("../../../categories/infrastructure/typeorm/category.orm-entity");
const product_series_orm_entity_1 = require("./product-series.orm-entity");
let ProductOrmEntity = class ProductOrmEntity {
    id;
    name;
    slug;
    description;
    images;
    priceFrom;
    isActive;
    isFeatured;
    specifications;
    categoryId;
    category;
    series;
    createdAt;
    updatedAt;
};
exports.ProductOrmEntity = ProductOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ProductOrmEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], ProductOrmEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductOrmEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', default: '' }),
    __metadata("design:type", Array)
], ProductOrmEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ProductOrmEntity.prototype, "priceFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ProductOrmEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProductOrmEntity.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], ProductOrmEntity.prototype, "specifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductOrmEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_orm_entity_1.CategoryOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", category_orm_entity_1.CategoryOrmEntity)
], ProductOrmEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_series_orm_entity_1.ProductSeriesOrmEntity, (s) => s.product, { cascade: true }),
    __metadata("design:type", Array)
], ProductOrmEntity.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductOrmEntity.prototype, "updatedAt", void 0);
exports.ProductOrmEntity = ProductOrmEntity = __decorate([
    (0, typeorm_1.Entity)('products'),
    (0, typeorm_1.Index)(['slug'], { unique: true }),
    (0, typeorm_1.Index)(['categoryId'])
], ProductOrmEntity);
//# sourceMappingURL=product.orm-entity.js.map