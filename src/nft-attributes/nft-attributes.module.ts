import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BedInformationRepository } from 'src/bed-information/repositories/bed-information.repository'
import { CategoryRepository } from 'src/category/category.repository'
import { NftRepository } from 'src/nfts/nfts.repository'
import { ProfitSevice } from 'src/profit/profit.service'
import { SpendingBalancesRepository } from 'src/spending_balances/spending_balances.repository'
import { TxHistoryModule } from 'src/tx-history/tx-history.module'

import { TrackingRepository } from "../tracking/repositories/tracking.repository";
import { TrackingModule } from '../tracking/tracking.module'
import { NftAttributesController } from './nft-attributes.controller'
import { NftAttributesRepository } from './nft-attributes.repository'
import { NftAttributesSevice } from './nft-attributes.service'

@Module({
  imports: [
    TxHistoryModule,
    TypeOrmModule.forFeature([
      NftAttributesRepository,
      NftRepository,
      SpendingBalancesRepository,
      BedInformationRepository,
      CategoryRepository,
      TrackingRepository,
    ]),
    TrackingModule
  ],
  controllers: [NftAttributesController],
  providers: [NftAttributesSevice, ProfitSevice],
  exports: [NftAttributesSevice]
})
export class NftAttributesModule { }
