import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CalculateRequestDto, CalculationType } from '../dto/calculate-request.dto'
import { SidingCalculatorService } from '../../domain/services/siding-calculator.service'

@ApiTags('Calculator')
@Controller('calculator')
export class CalculatorController {
  constructor(private readonly sidingCalc: SidingCalculatorService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Рассчитать количество материалов' })
  calculate(@Body() dto: CalculateRequestDto) {
    if (dto.type === CalculationType.SIDING) {
      return this.sidingCalc.calculate({
        wallWidth: dto.width,
        wallHeight: dto.height,
        panelWidth: dto.panelWidth ?? 230,
        panelLength: dto.panelLength ?? 3850,
        wasteFactor: dto.wasteFactor ?? 1.1,
      })
    }
    return { area: dto.width * dto.height, note: 'Используйте тип siding для детального расчёта' }
  }
}
