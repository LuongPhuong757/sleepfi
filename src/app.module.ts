import { BullModule } from '@nestjs/bull'
import { CacheModule, Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'
import * as redisStore from 'cache-manager-redis-store'

import { AdminModule } from './admin/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleModule } from './article/article.module'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { UserCode } from './databases/entities/user_code.entity'
import { GachaResultModule } from './gacha/gacha.module'
import { HealthAppDataModule } from './health-app-data/health-app-data.module'
import { LuckyBoxModule } from './lucky-box/lucky-box.module'
import { MailModule } from './mail/mail.module'
import { MarketPlaceModule } from './market-place/market-place.module'
import { MasterDataModule } from './master-data/master-data.module'
import { MintingPagelistModule } from './minting-page/minting-page.module'
import { NftAttributesModule } from './nft-attributes/nft-attributes.module'
import { NftModule } from './nfts/nfts.module'
import { PaymentModule } from './payment/payment.module'
import { PoinsModule } from './poins/poins.module'
import { SettingsModule } from './settings/settings.module'
import { SharedModule } from './shared/shared.module'
import { BroadcasterService } from './socket/broadcaster.service'
import { SocketModule } from './socket/socket.module'
import { SpendingBalancesModule } from './spending_balances/spending_balances.module'
import { StackDetailsModule } from './stack_details/stack_details.module'
import { TrackingModule } from './tracking/tracking.module'
import { TrackingResultModule } from './tracking-result/tracking-result.module'
import { TxHistoryModule } from './tx-history/tx-history.module'
import { UserModule } from './user/user.module'
import { UserCodeModule } from './user-code/user-code.module'
import { UserOtpModule } from './user-otp/user-otp.module'
import { UserWhitelistModule } from './user-whitelist/user-whitelist.module'
import { WithdrawModule } from './withdraw/withdraw.module'

@Module({
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    ArticleModule,
    MarketPlaceModule,
    CategoryModule,
    NftModule,
    WithdrawModule,
    SpendingBalancesModule,
    StackDetailsModule,
    UserOtpModule,
    MailModule,
    SettingsModule,
    ScheduleModule.forRoot(),
    NftAttributesModule,
    TrackingModule,
    TxHistoryModule,
    MasterDataModule,
    TrackingResultModule,
    LuckyBoxModule,
    HealthAppDataModule,
    BroadcasterService,
    SocketModule.forRoot(),
    GachaResultModule,
    PoinsModule,
    UserWhitelistModule,
    MintingPagelistModule,
    PaymentModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    AdminModule,
    UserCodeModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
