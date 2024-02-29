import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class BuyNftsInMarketPlaceDto {
  @ApiProperty({ required: true })
  @IsNumber()
  nftId: number
}
