"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const database_module_1 = require("./shared/database/database.module");
const redis_module_1 = require("./shared/redis/redis.module");
const s3_module_1 = require("./shared/s3/s3.module");
const categories_module_1 = require("./modules/categories/categories.module");
const products_module_1 = require("./modules/products/products.module");
const news_module_1 = require("./modules/news/news.module");
const banners_module_1 = require("./modules/banners/banners.module");
const documents_module_1 = require("./modules/documents/documents.module");
const calculator_module_1 = require("./modules/calculator/calculator.module");
const search_module_1 = require("./modules/search/search.module");
const orders_module_1 = require("./modules/orders/orders.module");
const auth_module_1 = require("./modules/auth/auth.module");
const upload_module_1 = require("./modules/upload/upload.module");
const app_config_1 = __importDefault(require("./config/app.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const aws_config_1 = __importDefault(require("./config/aws.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, database_config_1.default, redis_config_1.default, jwt_config_1.default, aws_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 60 }] }),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            s3_module_1.S3Module,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            news_module_1.NewsModule,
            banners_module_1.BannersModule,
            documents_module_1.DocumentsModule,
            calculator_module_1.CalculatorModule,
            search_module_1.SearchModule,
            orders_module_1.OrdersModule,
            auth_module_1.AuthModule,
            upload_module_1.UploadModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map