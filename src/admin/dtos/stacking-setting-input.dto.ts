import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { IsObjectCustom } from 'src/auth/decorators/is-object.decorator'

import { StackSettingDto } from './stacking_setting.dto'

export class StackingSettingInput {
  @ApiProperty({ example: [{ start: 0, end: 2500, value: 10 }] })
  @IsOptional()
  @IsArray()
  @IsObjectCustom()
  earningTokens: StackSettingDto[]

  @ApiProperty({ example: [{ start: 0, end: 2500, value: 10 }] })
  @IsArray()
  @IsOptional()
  @IsObjectCustom()
  mintingDiscount: StackSettingDto[]

  @ApiProperty({ example: [{ start: 0, end: 2500, value: 10 }] })
  @IsArray()
  @IsOptional()
  @IsObjectCustom()
  levelUpDiscount: StackSettingDto[]
}
