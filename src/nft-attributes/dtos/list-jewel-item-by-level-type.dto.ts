import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { CATEGORY_TYPE } from 'src/nfts/constants'

export class ListItemJewelByTypeLevelDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum([CATEGORY_TYPE.ITEM, CATEGORY_TYPE.JEWEL])
  @Type(() => Number)
  categoryId: number
}
