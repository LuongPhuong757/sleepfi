import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'
import { ITEM_TYPE } from 'src/nfts/constants'

export class ListNftsByOwnerDto {
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

  @ApiProperty({ required: true })
  @IsNumberString()
  categoryId: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type: string
}
