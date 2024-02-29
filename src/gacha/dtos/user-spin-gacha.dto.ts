import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class UserSpinGachaDto {
  // mode: 1: Normal Gacha Single, 1: Normal Gacha Multiple, 1: Special Gacha Single, 1: Special Gacha Multiple
  @ApiProperty({ required: true })
  @IsNumber()
  @Min(1, { message: 'Probability can not be less than 1' })
  @Max(4, { message: 'Probability cannot be greater than 4' })
  @IsNotEmpty()
  probability: number
}
