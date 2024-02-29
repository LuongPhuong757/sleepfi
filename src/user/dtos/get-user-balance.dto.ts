import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class GetUserBalanceInput {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number
}
