import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BedHistoryRepository } from 'src/bed-history/bed-history.repository'
import { NftAttributesRepository } from 'src/nft-attributes/nft-attributes.repository'
import { NftRepository } from 'src/nfts/nfts.repository'

import { TxHistoryModule } from '../tx-history/tx-history.module'
import { PoinsController } from './poins.controller'
import { PoinsRepository } from './poins.repository'
import { PoinsSevice } from './poins.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PoinsRepository,
      NftAttributesRepository,
      BedHistoryRepository,
      NftRepository
    ]),
    TxHistoryModule
  ],
  controllers: [PoinsController],
  providers: [PoinsSevice],
  exports: [PoinsSevice]
})
export class PoinsModule {}
