import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsOptional,
  Max,
  Min
} from 'class-validator'
import { SORT_PRICE } from 'src/nfts/constants'
// const enum test:  NFT_TYPE || JEWEL_AND_ITEM_TYPE
export class ListNftsInMarketPlaceDto {
  @ApiProperty({ default: 1, required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1

  @ApiProperty({ default: 10, required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit = 10

  @ApiProperty({ required: true })
  @IsNumber()
  categoryId: number

  @ApiProperty({ required: false, enum: SORT_PRICE })
  @IsOptional()
  sortPrice: string

  @ApiProperty({ required: false, nullable: true })
  @IsArray()
  type: string[]

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minLevel: number

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Max(50)
  maxLevel: number

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minBedMint: number

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Max(7)
  maxBedMint: number

  @ApiProperty({ required: false, nullable: true })
  @IsArray()
  classNft: string[]

  @ApiProperty({ required: false, nullable: true })
  @IsArray()
  quality: string[]
}
