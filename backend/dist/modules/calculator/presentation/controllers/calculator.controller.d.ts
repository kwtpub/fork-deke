import { CalculateRequestDto } from '../dto/calculate-request.dto';
import { SidingCalculatorService } from '../../domain/services/siding-calculator.service';
export declare class CalculatorController {
    private readonly sidingCalc;
    constructor(sidingCalc: SidingCalculatorService);
    calculate(dto: CalculateRequestDto): import("../../domain/services/siding-calculator.service").CalculationResult | {
        area: number;
        note: string;
    };
}
