import { Module } from '@nestjs/common'
import { SidingCalculatorService } from './domain/services/siding-calculator.service'
import { CalculatorController } from './presentation/controllers/calculator.controller'

@Module({
  controllers: [CalculatorController],
  providers: [SidingCalculatorService],
})
export class CalculatorModule {}
