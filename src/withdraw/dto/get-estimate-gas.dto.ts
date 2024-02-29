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

import { STATUS_GET_WITHDRAW, TYPE_GET_GAS } from '../constants'

export class GetEstimateGas {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEnum([TYPE_GET_GAS.NFT, TYPE_GET_GAS.TOKEN])
  type: string

  @IsNotEmpty()
  @ApiProperty({ required: false })
  @IsString()
  contractAddress: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tokenId: string
}
