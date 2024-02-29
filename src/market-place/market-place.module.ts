import { CacheModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as redisStore from 'cache-manager-redis-store'
import { CategoryRepository } from 'src/category/category.repository'
import { NftAttributesModule } from 'src/nft-attributes/nft-attributes.module'
import { NftModule } from 'src/nfts/nfts.module'
import { NftRepository } from 'src/nfts/nfts.repository'
import { SpendingBalancesModule } from 'src/spending_balances/spending_balances.module'
import { UserRepository } from 'src/user/repositories/user.repository'

import { TxHistoryModule } from '../tx-history/tx-history.module'
import { MarketPlaceController } from './market-place.controller'
import { MarketPlaceRepository } from './market-place.repository'
import { MarketPlaceSevice } from './market-place.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketPlaceRepository,
      CategoryRepository,
      NftRepository,
      UserRepository
    ]),
    NftAttributesModule,
    SpendingBalancesModule,
    NftModule,
    TxHistoryModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      ttl: 300
    })
  ],
  controllers: [MarketPlaceController],
  providers: [MarketPlaceSevice]
})
export class MarketPlaceModule {}
