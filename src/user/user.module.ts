import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOtpModule } from 'src/user-otp/user-otp.module'

import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/services/auth.service'
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy'
import { NftAttributesModule } from '../nft-attributes/nft-attributes.module'
import { SettingsModule } from '../settings/settings.module'
import { SharedModule } from '../shared/shared.module'
import {TrackingModule} from "../tracking/tracking.module";
import { UserCodeRepository } from '../user-code/repositories/user-code.repository'
import { UserOtpRepository } from '../user-otp/repositories/user-otp.repository'
import { UserWhitelistRepository } from '../user-whitelist/user-whitelist.repository'
import { UserController } from './controllers/user.controller'
import { UserRepository } from './repositories/user.repository'
import { UserService } from './services/user.service'
import { UserAclService } from './services/user-acl.service'
import { SpendingBalancesModule } from 'src/spending_balances/spending_balances.module'

@Module({
  imports: [
    SharedModule,
    UserOtpModule,
    SettingsModule,
    NftAttributesModule,
    TrackingModule,
    SpendingBalancesModule,
    TypeOrmModule.forFeature([
      UserRepository,
      UserCodeRepository,
      UserOtpRepository,
      UserWhitelistRepository
    ])
  ],
  providers: [UserService, JwtAuthStrategy, UserAclService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
