import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SettingController } from './controllers/setting.controller'
import { SettingsRepository } from './repositories/user-otp.repository'
import { SettingsService } from './services/settings.service'

@Module({
  imports: [TypeOrmModule.forFeature([SettingsRepository])],
  controllers: [SettingController],
  providers: [SettingsService],
  exports: [SettingsService]
})
export class SettingsModule {}
