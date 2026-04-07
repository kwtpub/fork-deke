"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidingCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let SidingCalculatorService = class SidingCalculatorService {
    calculate(params) {
        const { wallWidth, wallHeight, panelWidth, panelLength, wasteFactor = 1.1 } = params;
        const area = wallWidth * wallHeight;
        const panelArea = (panelWidth / 1000) * (panelLength / 1000);
        const panelsCount = Math.ceil((area * wasteFactor) / panelArea);
        const panelsPerPackage = 10;
        const packagesCount = Math.ceil(panelsCount / panelsPerPackage);
        return { area: Math.round(area * 100) / 100, panelsCount, packagesCount, panelsPerPackage };
    }
};
exports.SidingCalculatorService = SidingCalculatorService;
exports.SidingCalculatorService = SidingCalculatorService = __decorate([
    (0, common_1.Injectable)()
], SidingCalculatorService);
//# sourceMappingURL=siding-calculator.service.js.map