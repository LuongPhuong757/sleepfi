import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class PaymentDto {
  @ApiProperty({ required: true })
  @IsNumber()
  sourceAmount: number

  @ApiProperty({ required: true })
  @IsString()
  sourceCurrency: string

  @ApiProperty({ required: true })
  @IsString()
  destCurrency: string

  @ApiProperty({ required: true })
  @IsString()
  dest: string

  @ApiProperty({ required: true })
  @IsString()
  country: string
}
