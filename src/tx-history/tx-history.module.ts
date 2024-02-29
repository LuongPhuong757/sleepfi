import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TxHistoryController } from './tx-history.controller'
import { TxHistoryRepository } from './tx-history.repository'
import { TxHistorySevice } from './tx-history.service'

@Module({
  imports: [TypeOrmModule.forFeature([TxHistoryRepository])],
  controllers: [TxHistoryController],
  providers: [TxHistorySevice],
  exports: [TxHistorySevice]
})
export class TxHistoryModule {}
