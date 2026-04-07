"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_controller_1 = require("./presentation/controllers/upload.controller");
const s3_module_1 = require("../../shared/s3/s3.module");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: require('multer').memoryStorage(),
                limits: { fileSize: 10 * 1024 * 1024 },
                fileFilter: (_req, file, cb) => {
                    const allowed = /\.(jpg|jpeg|png|webp|gif|pdf)$/i;
                    if (!allowed.test(file.originalname)) {
                        return cb(new Error('Недопустимый тип файла'), false);
                    }
                    cb(null, true);
                },
            }),
            s3_module_1.S3Module,
        ],
        controllers: [upload_controller_1.UploadController],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map