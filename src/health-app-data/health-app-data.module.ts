import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HealthAppDataController } from './health-app-data.controller'
import { HealthAppDataRepository } from './health-app-data.repository'
import { HealthAppDataSevice } from './health-app-data.service'

@Module({
  imports: [TypeOrmModule.forFeature([HealthAppDataRepository])],
  controllers: [HealthAppDataController],
  providers: [HealthAppDataSevice],
  exports: [HealthAppDataSevice]
})
export class HealthAppDataModule {}
