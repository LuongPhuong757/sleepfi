import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfitSevice } from 'src/profit/profit.service'

import { MarketOrderRepository } from './market_order.respository'
import { MarketOrderConsumer } from './queue/market_orders.consumer'
import { SpendingBalancesController } from './spending_balances.controller'
import { SpendingBalancesRepository } from './spending_balances.repository'
import { SpendingBalancesSevice } from './spending_balances.service'

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'market-orders',
      useFactory: async () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT)
        },
      }),
    }),
    TypeOrmModule.forFeature([
      SpendingBalancesRepository,
      MarketOrderRepository
    ])
  ],
  controllers: [SpendingBalancesController],
  providers: [SpendingBalancesSevice, MarketOrderConsumer, ProfitSevice],
  exports: [SpendingBalancesSevice]
})
export class SpendingBalancesModule { }
