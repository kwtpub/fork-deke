export interface SidingCalculateParams {
    wallWidth: number;
    wallHeight: number;
    panelWidth: number;
    panelLength: number;
    wasteFactor?: number;
}
export interface CalculationResult {
    area: number;
    panelsCount: number;
    packagesCount: number;
    panelsPerPackage: number;
}
export declare class SidingCalculatorService {
    calculate(params: SidingCalculateParams): CalculationResult;
}
