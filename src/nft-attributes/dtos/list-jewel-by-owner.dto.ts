import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'

export class ListJewelOwnerDto {
  @ApiProperty({ required: false })
  @IsNumber()
  bedId: number

  @ApiProperty({ required: false })
  @IsNumber()
  jewelId: number

  @ApiProperty({ required: false })
  @IsNumber()
  index: number
}
