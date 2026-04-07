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
exports.ProductColorOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const product_series_orm_entity_1 = require("./product-series.orm-entity");
let ProductColorOrmEntity = class ProductColorOrmEntity {
    id;
    name;
    hex;
    image;
    seriesId;
    series;
};
exports.ProductColorOrmEntity = ProductColorOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductColorOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ProductColorOrmEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ProductColorOrmEntity.prototype, "hex", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductColorOrmEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductColorOrmEntity.prototype, "seriesId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_series_orm_entity_1.ProductSeriesOrmEntity, (s) => s.colors, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'seriesId' }),
    __metadata("design:type", product_series_orm_entity_1.ProductSeriesOrmEntity)
], ProductColorOrmEntity.prototype, "series", void 0);
exports.ProductColorOrmEntity = ProductColorOrmEntity = __decorate([
    (0, typeorm_1.Entity)('product_colors')
], ProductColorOrmEntity);
//# sourceMappingURL=product-color.orm-entity.js.map