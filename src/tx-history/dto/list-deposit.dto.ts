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

export class ListDepositDto {
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

  @ApiProperty({ format: 'date', required: false })
  @Type(() => Date)
  @IsOptional()
  startDate: Date

  @ApiProperty({ format: 'date', required: false })
  @Type(() => Date)
  @IsOptional()
  endDate: Date
}
