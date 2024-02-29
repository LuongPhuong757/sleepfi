import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

import { KEY_VALUE_ACTIVE_CODE_SETTING } from '../constants/key_setting'

export class SettingActiveCodeDto {
  @ApiProperty({
    description: 'setting on off active code for sign up',
    default: KEY_VALUE_ACTIVE_CODE_SETTING.ACTIVE,
    enum: KEY_VALUE_ACTIVE_CODE_SETTING
  })
  @IsEnum(KEY_VALUE_ACTIVE_CODE_SETTING)
  @IsNotEmpty()
  value: KEY_VALUE_ACTIVE_CODE_SETTING
}
