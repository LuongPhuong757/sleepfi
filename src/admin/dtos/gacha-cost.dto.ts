import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class GachaCostDto {
  @IsNumber()
  @ApiProperty({
    example: 24
  })
  normalGachaSingle: number

  @IsNumber()
  @ApiProperty({
    example: 240
  })
  specialGachaSingle: number

  @IsNumber()
  @ApiProperty({
    example: 200
  })
  normalGachaMultiple: number

  @IsNumber()
  @ApiProperty({
    example: 2000
  })
  specialGachaMultiple: number
}
