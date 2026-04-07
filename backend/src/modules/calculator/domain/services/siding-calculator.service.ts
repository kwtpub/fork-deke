import { Injectable } from '@nestjs/common'

export interface SidingCalculateParams {
  wallWidth: number
  wallHeight: number
  panelWidth: number
  panelLength: number
  wasteFactor?: number
}

export interface CalculationResult {
  area: number
  panelsCount: number
  packagesCount: number
  panelsPerPackage: number
}

@Injectable()
export class SidingCalculatorService {
  calculate(params: SidingCalculateParams): CalculationResult {
    const { wallWidth, wallHeight, panelWidth, panelLength, wasteFactor = 1.1 } = params
    const area = wallWidth * wallHeight
    const panelArea = (panelWidth / 1000) * (panelLength / 1000)
    const panelsCount = Math.ceil((area * wasteFactor) / panelArea)
    const panelsPerPackage = 10
    const packagesCount = Math.ceil(panelsCount / panelsPerPackage)
    return { area: Math.round(area * 100) / 100, panelsCount, packagesCount, panelsPerPackage }
  }
}
