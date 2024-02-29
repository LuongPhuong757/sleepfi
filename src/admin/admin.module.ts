import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GachaProbConfigRepository } from 'src/gacha/gacha-prob-config.repository'
import { GachaResultRepository } from 'src/gacha/user-gacha-result.repository'

import { StackDetails } from '../databases/entities/stack_details.entity'
import { TrackingRepository } from '../tracking/repositories/tracking.repository'
import { TxHistoryRepository } from '../tx-history/tx-history.repository'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrackingRepository,
      TxHistoryRepository,
      GachaResultRepository,
      GachaProbConfigRepository,
      StackDetails
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
