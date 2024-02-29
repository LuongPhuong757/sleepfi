import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class GachaResetTimeDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100
  })
  commonResetTime: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100
  })
  specialResetTime: number
}
