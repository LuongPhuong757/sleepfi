import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'

import { WITHDRAW_TYPE } from '../constants'

export class CreateWithdrawDto {
  @ApiProperty({ default: WITHDRAW_TYPE.TOKEN })
  @IsNotEmpty()
  type: string

  @ApiProperty({ required: true })
  @IsString()
  tokenAddress: string

  @ApiProperty({ required: true })
  @IsNumberString()
  amount: string

  @ApiProperty({ required: true })
  @IsString()
  signedMessage: string

  @ApiProperty({ required: true })
  @IsString()
  signer: string

  // @ApiProperty({ required: true })
  // @IsString()
  // mainWallet: string

  // @ApiProperty({ required: true })
  // @IsString()
  // userWallet: string

  // @ApiProperty({ required: false })
  // @IsString()
  // txHash: string
}
