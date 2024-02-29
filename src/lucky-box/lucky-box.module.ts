import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LuckyBox } from 'src/databases/entities/lucky_box.entity'
import { NftAttributesRepository } from 'src/nft-attributes/nft-attributes.repository'
import { ProfitSevice } from 'src/profit/profit.service'
import { SpendingBalancesModule } from 'src/spending_balances/spending_balances.module'
import { TxHistoryModule } from 'src/tx-history/tx-history.module'

import { LuckyBoxController } from './lucky-box.controller'
import { LuckyBoxSevice } from './lucky-box.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([LuckyBox, NftAttributesRepository]),
    SpendingBalancesModule,
    TxHistoryModule
  ],
  controllers: [LuckyBoxController],
  providers: [LuckyBoxSevice, ProfitSevice],
  exports: [LuckyBoxSevice]
})
export class LuckyBoxModule { }
