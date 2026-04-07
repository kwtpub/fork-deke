import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum CalculationType { SIDING = 'siding', ROOFING = 'roofing', GUTTERS = 'gutters' }

export class CalculateRequestDto {
  @ApiProperty({ enum: CalculationType })
  @IsEnum(CalculationType)
  type: CalculationType

  @ApiProperty({ description: 'Ширина стены/крыши в метрах' })
  @IsNumber() @Min(0.1)
  width: number

  @ApiProperty({ description: 'Высота стены / длина ската в метрах' })
  @IsNumber() @Min(0.1)
  height: number

  @ApiProperty({ description: 'Ширина панели/черепицы в мм', required: false })
  @IsOptional() @IsNumber()
  panelWidth?: number

  @ApiProperty({ description: 'Длина панели/черепицы в мм', required: false })
  @IsOptional() @IsNumber()
  panelLength?: number

  @ApiProperty({ description: 'Коэффициент запаса', required: false })
  @IsOptional() @IsNumber()
  wasteFactor?: number
}
