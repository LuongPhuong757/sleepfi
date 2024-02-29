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

export class ListItemOwnerDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  type: string[]

  @ApiProperty({ required: false })
  @IsOptional()
  @Min(1)
  @IsNumber()
  minLevel: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Max(5)
  @IsNumber()
  maxLevel: number
}
