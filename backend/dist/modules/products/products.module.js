"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const product_orm_entity_1 = require("./infrastructure/typeorm/product.orm-entity");
const product_series_orm_entity_1 = require("./infrastructure/typeorm/product-series.orm-entity");
const product_color_orm_entity_1 = require("./infrastructure/typeorm/product-color.orm-entity");
const product_typeorm_repository_1 = require("./infrastructure/repositories/product.typeorm.repository");
const product_repository_interface_1 = require("./domain/repositories/product.repository.interface");
const get_products_list_use_case_1 = require("./application/use-cases/get-products-list/get-products-list.use-case");
const get_product_by_slug_use_case_1 = require("./application/use-cases/get-product-by-slug/get-product-by-slug.use-case");
const products_controller_1 = require("./presentation/controllers/products.controller");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_orm_entity_1.ProductOrmEntity, product_series_orm_entity_1.ProductSeriesOrmEntity, product_color_orm_entity_1.ProductColorOrmEntity]), auth_module_1.AuthModule],
        controllers: [products_controller_1.ProductsController],
        providers: [
            get_products_list_use_case_1.GetProductsListUseCase,
            get_product_by_slug_use_case_1.GetProductBySlugUseCase,
            { provide: product_repository_interface_1.PRODUCT_REPOSITORY, useClass: product_typeorm_repository_1.ProductTypeormRepository },
        ],
        exports: [product_repository_interface_1.PRODUCT_REPOSITORY],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map