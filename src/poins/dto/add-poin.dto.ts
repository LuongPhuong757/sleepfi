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

export class AddPoinDto {
  @ApiProperty({ required: true })
  @IsNumber()
  bedId: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  efficiency: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  luck: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  bonus: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  special: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  resilience: number
}
