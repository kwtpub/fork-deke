export declare enum CalculationType {
    SIDING = "siding",
    ROOFING = "roofing",
    GUTTERS = "gutters"
}
export declare class CalculateRequestDto {
    type: CalculationType;
    width: number;
    height: number;
    panelWidth?: number;
    panelLength?: number;
    wasteFactor?: number;
}
