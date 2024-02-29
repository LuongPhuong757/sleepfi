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

export class GetTokenToUpgradeInput {
  @IsOptional()
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  level: number

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  @IsEnum([CATEGORY_TYPE.ITEM, CATEGORY_TYPE.JEWEL])
  @Type(() => Number)
  upgradeType: number
}
