import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTxHistoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: number

  @ApiProperty({ required: true })
  @IsString()
  symbol: string

  @ApiProperty({ required: true })
  @IsString()
  tokenAddress: string

  @ApiProperty({ required: true })
  @IsString()
  amount: string

  @ApiProperty({ required: false })
  @IsOptional()
  tokenId: string

  @ApiProperty({ required: false })
  @IsOptional()
  contractAddress: string

  @ApiProperty({ required: false })
  @IsString()
  tx: string
}

export class TxHistoryExtends extends CreateTxHistoryDto {}
