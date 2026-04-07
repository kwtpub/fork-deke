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
exports.CalculatorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const calculate_request_dto_1 = require("../dto/calculate-request.dto");
const siding_calculator_service_1 = require("../../domain/services/siding-calculator.service");
let CalculatorController = class CalculatorController {
    sidingCalc;
    constructor(sidingCalc) {
        this.sidingCalc = sidingCalc;
    }
    calculate(dto) {
        if (dto.type === calculate_request_dto_1.CalculationType.SIDING) {
            return this.sidingCalc.calculate({
                wallWidth: dto.width,
                wallHeight: dto.height,
                panelWidth: dto.panelWidth ?? 230,
                panelLength: dto.panelLength ?? 3850,
                wasteFactor: dto.wasteFactor ?? 1.1,
            });
        }
        return { area: dto.width * dto.height, note: 'Используйте тип siding для детального расчёта' };
    }
};
exports.CalculatorController = CalculatorController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Рассчитать количество материалов' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_request_dto_1.CalculateRequestDto]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "calculate", null);
exports.CalculatorController = CalculatorController = __decorate([
    (0, swagger_1.ApiTags)('Calculator'),
    (0, common_1.Controller)('calculator'),
    __metadata("design:paramtypes", [siding_calculator_service_1.SidingCalculatorService])
], CalculatorController);
//# sourceMappingURL=calculator.controller.js.map