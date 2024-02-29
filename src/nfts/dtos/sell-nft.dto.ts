import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'

export class SellNftInput {
  @ApiProperty({ required: true })
  @IsNumber()
  nftId: number

  @ApiProperty({ required: true })
  @IsNumberString()
  amount: string
}
