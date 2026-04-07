"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const news_orm_entity_1 = require("./infrastructure/typeorm/news.orm-entity");
const news_typeorm_repository_1 = require("./infrastructure/repositories/news.typeorm.repository");
const news_repository_interface_1 = require("./domain/repositories/news.repository.interface");
const get_news_list_use_case_1 = require("./application/use-cases/get-news-list/get-news-list.use-case");
const get_news_by_slug_use_case_1 = require("./application/use-cases/get-news-by-slug/get-news-by-slug.use-case");
const news_controller_1 = require("./presentation/controllers/news.controller");
let NewsModule = class NewsModule {
};
exports.NewsModule = NewsModule;
exports.NewsModule = NewsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([news_orm_entity_1.NewsOrmEntity]), auth_module_1.AuthModule],
        controllers: [news_controller_1.NewsController],
        providers: [
            get_news_list_use_case_1.GetNewsListUseCase, get_news_by_slug_use_case_1.GetNewsBySlugUseCase,
            { provide: news_repository_interface_1.NEWS_REPOSITORY, useClass: news_typeorm_repository_1.NewsTypeormRepository },
        ],
    })
], NewsModule);
//# sourceMappingURL=news.module.js.map