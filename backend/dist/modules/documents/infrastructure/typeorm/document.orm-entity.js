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
exports.DocumentOrmEntity = exports.DocumentType = void 0;
const typeorm_1 = require("typeorm");
var DocumentType;
(function (DocumentType) {
    DocumentType["CERTIFICATE"] = "certificate";
    DocumentType["INSTRUCTION"] = "instruction";
    DocumentType["TECHNICAL"] = "technical";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
let DocumentOrmEntity = class DocumentOrmEntity {
    id;
    name;
    fileUrl;
    thumbnailUrl;
    type;
    categoryId;
    isPublished;
    createdAt;
};
exports.DocumentOrmEntity = DocumentOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DocumentOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], DocumentOrmEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentOrmEntity.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DocumentOrmEntity.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DocumentType, default: DocumentType.INSTRUCTION }),
    __metadata("design:type", String)
], DocumentOrmEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DocumentOrmEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DocumentOrmEntity.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DocumentOrmEntity.prototype, "createdAt", void 0);
exports.DocumentOrmEntity = DocumentOrmEntity = __decorate([
    (0, typeorm_1.Entity)('documents')
], DocumentOrmEntity);
//# sourceMappingURL=document.orm-entity.js.map