import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { OrderType } from '../../infrastructure/typeorm/order.orm-entity'

export class CreateOrderDto {
  @ApiProperty({ enum: OrderType, required: false })
  @IsOptional() @IsEnum(OrderType)
  type?: OrderType

  @ApiProperty() @IsNotEmpty() @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/, { message: 'Неверный формат телефона' })
  phone: string

  @ApiProperty({ required: false })
  @IsOptional() @IsEmail({}, { message: 'Неверный email' })
  email?: string

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  message?: string

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  productId?: string
}
