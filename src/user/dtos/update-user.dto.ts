import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'

import { SEX } from '../constants'

export class UpdateUser {
  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(100)
  @IsEnum([SEX.MALE, SEX.FEMALE, SEX.SECRET, SEX.OTHER])
  @IsString()
  sex: string

  @ApiPropertyOptional()
  @IsOptional()
  birthday: number

  @ApiPropertyOptional()
  @IsOptional()
  isNotification: boolean

  @ApiPropertyOptional()
  @IsOptional()
  isNewLetter: boolean
}
