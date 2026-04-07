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
exports.GetCategoryBySlugUseCase = void 0;
const common_1 = require("@nestjs/common");
const category_repository_interface_1 = require("../../../domain/repositories/category.repository.interface");
let GetCategoryBySlugUseCase = class GetCategoryBySlugUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(slug) {
        const category = await this.categoryRepo.findBySlug(slug);
        if (!category)
            throw new common_1.NotFoundException(`Категория '${slug}' не найдена`);
        return category;
    }
};
exports.GetCategoryBySlugUseCase = GetCategoryBySlugUseCase;
exports.GetCategoryBySlugUseCase = GetCategoryBySlugUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(category_repository_interface_1.CATEGORY_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetCategoryBySlugUseCase);
//# sourceMappingURL=get-category-by-slug.use-case.js.map