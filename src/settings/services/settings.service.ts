import { Injectable } from '@nestjs/common'

import { Settings } from '../../databases/entities/settings.entity'
import {
  KEY_SETTING,
  KEY_VALUE_ACTIVE_CODE_SETTING
} from '../constants/key_setting'
import { SettingActiveCodeDto } from '../dtos/setting-active-code.dto'
import { SettingsRepository } from '../repositories/user-otp.repository'

@Injectable()
export class SettingsService {
  constructor(private readonly repository: SettingsRepository) {}

  getSetting(key: KEY_SETTING): Promise<Settings> {
    return this.repository.findOne({ where: { key } })
  }

  async setActiveCode(dto: SettingActiveCodeDto): Promise<string> {
    const setting = await this.repository.findOne({
      where: { key: KEY_SETTING.ENABLE_ACTIVE_CODE }
    })
    await this.repository.save({
      id: setting.id,
      value: dto.value === KEY_VALUE_ACTIVE_CODE_SETTING.ACTIVE ? '1' : '0'
    })
    return 'Success'
  }
}
