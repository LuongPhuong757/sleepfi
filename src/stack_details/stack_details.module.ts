import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpendingBalances } from 'crawler/entities/SpendingBalance.entity'
import { StackDetails } from 'src/databases/entities/stack_details.entity'
import { Stakes } from 'src/databases/entities/stakes.entity'
import { ProfitSevice } from 'src/profit/profit.service'
import { AppLoggerModule } from 'src/shared/logger/logger.module'
import { SpendingBalancesModule } from 'src/spending_balances/spending_balances.module'
import { SpendingBalancesRepository } from 'src/spending_balances/spending_balances.repository'

import { User } from '../databases/entities/user.entity'
import { UserStakeEntity } from '../databases/entities/user_stake.entity'
import { StackDetailsController } from './stack_details.controller'
import { StackDetailsService } from './stack_details.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([StackDetails, Stakes, User, UserStakeEntity]),
    AppLoggerModule,
    ScheduleModule.forRoot(),
    SpendingBalancesModule
  ],
  controllers: [StackDetailsController],
  providers: [StackDetailsService, ProfitSevice]
})
export class StackDetailsModule { }
