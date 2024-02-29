import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class SpeedUpInput {
  // @ApiPropertyOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // timeUp: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  luckyBoxId: number
}
