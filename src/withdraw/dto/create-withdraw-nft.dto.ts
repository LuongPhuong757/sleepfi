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

export class CreateWithdrawNftDto {
  @ApiProperty({ default: WITHDRAW_TYPE.NFT })
  @IsNotEmpty()
  type: string

  @ApiProperty({ required: true })
  @IsString()
  contractAddress: string

  @ApiProperty({ required: true })
  @IsString()
  tokenId: string

  @ApiProperty({ required: true })
  @IsString()
  signedMessage: string

  @ApiProperty({ required: true })
  @IsString()
  signer: string

  // @ApiProperty({ required: true })
  // @IsString()
  // mainWallet: string

  // @ApiProperty({ required: false })
  // @IsString()
  // txHash: string
}
