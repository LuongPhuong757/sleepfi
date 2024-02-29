import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BedInformationRepository } from '../bed-information/repositories/bed-information.repository'
import { HealthAppData } from '../databases/entities/health-app-data.entity'
import { LuckyBox } from '../databases/entities/lucky_box.entity'
import { TrackingResult } from '../databases/entities/tracking-result.entity'
import { UserEarnTransactions } from '../databases/entities/user_earn_transactions.entity'
import { UserStakeEntity } from '../databases/entities/user_stake.entity'
import { HealthAppDataModule } from '../health-app-data/health-app-data.module'
import { LuckyBoxModule } from '../lucky-box/lucky-box.module'
import { MasterDataModule } from '../master-data/master-data.module'
import { NftAttributesRepository } from '../nft-attributes/nft-attributes.repository'
import { NftModule } from '../nfts/nfts.module'
import { NftRepository } from '../nfts/nfts.repository'
import { SettingsModule } from '../settings/settings.module'
import { SpendingBalancesModule } from '../spending_balances/spending_balances.module'
import { TrackingResultModule } from '../tracking-result/tracking-result.module'
import {TxHistoryModule} from "../tx-history/tx-history.module";
import { TxHistorySevice } from "../tx-history/tx-history.service";
import { UserRepository } from '../user/repositories/user.repository'
import { TrackingRepository } from './repositories/tracking.repository'
import { TrackingController } from './tracking.controller'
import { TrackingService } from './tracking.service'
import { TrackingV2Service } from './v2/tracking-v2.service'

@Module({
  imports: [
    NftModule,
    MasterDataModule,
    SpendingBalancesModule,
    LuckyBoxModule,
    HealthAppDataModule,
    SettingsModule,
    TrackingResultModule,
    TxHistoryModule,
    TypeOrmModule.forFeature([
      TrackingRepository,
      NftRepository,
      UserRepository,
      NftAttributesRepository,
      TrackingResult,
      HealthAppData,
      UserStakeEntity,
      BedInformationRepository,
      LuckyBox,
      UserEarnTransactions
    ])
  ],
  providers: [TrackingService, ConfigService, TrackingV2Service],
  controllers: [TrackingController],
  exports: [TrackingService]
})
export class TrackingModule {}
