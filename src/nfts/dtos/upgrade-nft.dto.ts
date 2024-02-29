import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

import { CATEGORY_TYPE } from '../constants'

export class UpgradeNftsInput {
  @ApiProperty()
  @IsArray()
  @Type(() => Array)
  nftIds: number[]

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  @IsEnum([CATEGORY_TYPE.ITEM, CATEGORY_TYPE.JEWEL])
  upgradeType: number
}
