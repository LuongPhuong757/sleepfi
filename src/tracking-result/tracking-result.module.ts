import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HealthAppDataRepository } from '../health-app-data/health-app-data.repository'
import { TrackingRepository } from '../tracking/repositories/tracking.repository'
import { TrackingResultController } from './tracking-result.controller'
import { TrackingResultRepository } from './tracking-result.repository'
import { TrackingResultSevice } from './tracking-result.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrackingResultRepository,
      HealthAppDataRepository,
      TrackingRepository
    ])
  ],
  controllers: [TrackingResultController],
  providers: [TrackingResultSevice],
  exports: [TrackingResultSevice]
})
export class TrackingResultModule {}
