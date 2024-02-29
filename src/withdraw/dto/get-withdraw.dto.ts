import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'

import { STATUS_GET_WITHDRAW, TYPE_GET_WITHDRAW } from '../constants'

export class GetWithdrawInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEnum([STATUS_GET_WITHDRAW.HISTORY, STATUS_GET_WITHDRAW.PENDING])
  status: string

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEnum([TYPE_GET_WITHDRAW.NFT, TYPE_GET_WITHDRAW.TOKEN])
  type: string

  @ApiProperty({ default: 1, required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number

  @ApiProperty({ default: 10, required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number
}
