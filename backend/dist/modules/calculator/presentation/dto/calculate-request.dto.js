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
exports.CalculateRequestDto = exports.CalculationType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var CalculationType;
(function (CalculationType) {
    CalculationType["SIDING"] = "siding";
    CalculationType["ROOFING"] = "roofing";
    CalculationType["GUTTERS"] = "gutters";
})(CalculationType || (exports.CalculationType = CalculationType = {}));
class CalculateRequestDto {
    type;
    width;
    height;
    panelWidth;
    panelLength;
    wasteFactor;
}
exports.CalculateRequestDto = CalculateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CalculationType }),
    (0, class_validator_1.IsEnum)(CalculationType),
    __metadata("design:type", String)
], CalculateRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ширина стены/крыши в метрах' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], CalculateRequestDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Высота стены / длина ската в метрах' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], CalculateRequestDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ширина панели/черепицы в мм', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CalculateRequestDto.prototype, "panelWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Длина панели/черепицы в мм', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CalculateRequestDto.prototype, "panelLength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Коэффициент запаса', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CalculateRequestDto.prototype, "wasteFactor", void 0);
//# sourceMappingURL=calculate-request.dto.js.map