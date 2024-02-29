import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfitSevice } from 'src/profit/profit.service'
import { SpendingBalancesModule } from 'src/spending_balances/spending_balances.module'
import { TxHistoryModule } from 'src/tx-history/tx-history.module'
import { TxHistoryRepository } from 'src/tx-history/tx-history.repository'
import { TxHistorySevice } from 'src/tx-history/tx-history.service'

import { HealthAppDataRepository } from '../health-app-data/health-app-data.repository'
import { NftAttributesModule } from '../nft-attributes/nft-attributes.module'
import { SpendingBalancesRepository } from '../spending_balances/spending_balances.repository'
import { GachaController } from './gacha.controller'
import { GachaSevice } from './gacha.service'
import { GachaProbConfigRepository } from './gacha-prob-config.repository'
import { UserGachaInfoRepository } from './user-gacha-info.repository'
import { GachaResultRepository } from './user-gacha-result.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GachaResultRepository,
      HealthAppDataRepository,
      SpendingBalancesRepository,
      GachaProbConfigRepository,
      UserGachaInfoRepository
    ]),
    NftAttributesModule,
    TxHistoryModule,
    SpendingBalancesModule
  ],
  controllers: [GachaController],
  providers: [GachaSevice, ProfitSevice],
  exports: [GachaSevice]
})
export class GachaResultModule { }
