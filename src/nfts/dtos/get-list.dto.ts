import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsEnum, IsOptional } from 'class-validator'

import { CATEGORY_NAME } from '../../category/constants'

export class GetListDto {
  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'array of token ids example 1,2,3',
    type: 'String'
  })
  @Transform(({ value }) => value.split(','))
  tokenIds?: number[]

  @IsEnum(CATEGORY_NAME)
  @ApiProperty({
    required: true,
    type: 'Enum',
    enum: CATEGORY_NAME,
    default: CATEGORY_NAME.BED,
    description: 'type of nft'
  })
  nftType: CATEGORY_NAME
}
