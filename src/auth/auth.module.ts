import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserTokenModule } from 'src/user-token/user-token.module'

import { NftAttributesModule } from '../nft-attributes/nft-attributes.module'
import { SettingsModule } from '../settings/settings.module'
import { SharedModule } from '../shared/shared.module'
import { TrackingModule } from '../tracking/tracking.module'
import { UserRepository } from '../user/repositories/user.repository'
import { UserService } from '../user/services/user.service'
import { UserModule } from '../user/user.module'
import { UserCodeRepository } from '../user-code/repositories/user-code.repository'
import { UserOtpRepository } from '../user-otp/repositories/user-otp.repository'
import { UserOtpModule } from '../user-otp/user-otp.module'
import { UserWhitelistRepository } from '../user-whitelist/user-whitelist.repository'
import { STRATEGY_JWT_AUTH } from './constants/strategy.constant'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { SpendingBalancesModule } from 'src/spending_balances/spending_balances.module'

@Global()
@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256'
        }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    SettingsModule,
    UserOtpModule,
    UserTokenModule,
    TrackingModule,
    NftAttributesModule,
    SpendingBalancesModule,
    TypeOrmModule.forFeature([
      UserRepository,
      UserCodeRepository,
      UserOtpRepository,
      UserWhitelistRepository
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    UserService
  ],
  exports: [AuthService, UserService]
})
export class AuthModule {}
