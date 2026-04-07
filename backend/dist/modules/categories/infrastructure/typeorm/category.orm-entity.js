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
exports.CategoryOrmEntity = void 0;
const typeorm_1 = require("typeorm");
let CategoryOrmEntity = class CategoryOrmEntity {
    id;
    name;
    slug;
    description;
    image;
    icon;
    sortOrder;
    parentId;
    parent;
    children;
    createdAt;
    updatedAt;
};
exports.CategoryOrmEntity = CategoryOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CategoryOrmEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CategoryOrmEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CategoryOrmEntity, (c) => c.children, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'parentId' }),
    __metadata("design:type", CategoryOrmEntity)
], CategoryOrmEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CategoryOrmEntity, (c) => c.parent),
    __metadata("design:type", Array)
], CategoryOrmEntity.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CategoryOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CategoryOrmEntity.prototype, "updatedAt", void 0);
exports.CategoryOrmEntity = CategoryOrmEntity = __decorate([
    (0, typeorm_1.Entity)('categories'),
    (0, typeorm_1.Index)(['slug'], { unique: true })
], CategoryOrmEntity);
//# sourceMappingURL=category.orm-entity.js.map