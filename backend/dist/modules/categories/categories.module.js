"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const category_orm_entity_1 = require("./infrastructure/typeorm/category.orm-entity");
const category_typeorm_repository_1 = require("./infrastructure/repositories/category.typeorm.repository");
const category_repository_interface_1 = require("./domain/repositories/category.repository.interface");
const get_categories_tree_use_case_1 = require("./application/use-cases/get-categories-tree/get-categories-tree.use-case");
const get_category_by_slug_use_case_1 = require("./application/use-cases/get-category-by-slug/get-category-by-slug.use-case");
const categories_controller_1 = require("./presentation/controllers/categories.controller");
let CategoriesModule = class CategoriesModule {
};
exports.CategoriesModule = CategoriesModule;
exports.CategoriesModule = CategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([category_orm_entity_1.CategoryOrmEntity]), auth_module_1.AuthModule],
        controllers: [categories_controller_1.CategoriesController],
        providers: [
            get_categories_tree_use_case_1.GetCategoriesTreeUseCase,
            get_category_by_slug_use_case_1.GetCategoryBySlugUseCase,
            { provide: category_repository_interface_1.CATEGORY_REPOSITORY, useClass: category_typeorm_repository_1.CategoryTypeormRepository },
        ],
        exports: [category_repository_interface_1.CATEGORY_REPOSITORY],
    })
], CategoriesModule);
//# sourceMappingURL=categories.module.js.map