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
exports.ProductSeriesOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const product_orm_entity_1 = require("./product.orm-entity");
const product_color_orm_entity_1 = require("./product-color.orm-entity");
let ProductSeriesOrmEntity = class ProductSeriesOrmEntity {
    id;
    name;
    slug;
    description;
    coverImage;
    specs;
    productId;
    product;
    colors;
};
exports.ProductSeriesOrmEntity = ProductSeriesOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductSeriesOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ProductSeriesOrmEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ProductSeriesOrmEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductSeriesOrmEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSeriesOrmEntity.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], ProductSeriesOrmEntity.prototype, "specs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductSeriesOrmEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_orm_entity_1.ProductOrmEntity, (p) => p.series, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_orm_entity_1.ProductOrmEntity)
], ProductSeriesOrmEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_color_orm_entity_1.ProductColorOrmEntity, (c) => c.series, { cascade: true }),
    __metadata("design:type", Array)
], ProductSeriesOrmEntity.prototype, "colors", void 0);
exports.ProductSeriesOrmEntity = ProductSeriesOrmEntity = __decorate([
    (0, typeorm_1.Entity)('product_series'),
    (0, typeorm_1.Index)(['slug'])
], ProductSeriesOrmEntity);
//# sourceMappingURL=product-series.orm-entity.js.map