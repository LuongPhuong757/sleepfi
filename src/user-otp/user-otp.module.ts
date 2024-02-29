import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MailModule } from '../mail/mail.module'
import { SharedModule } from '../shared/shared.module'
import { UserRepository } from '../user/repositories/user.repository'
import { UserWhitelistRepository } from '../user-whitelist/user-whitelist.repository'
import { UserOtpController } from './controller/user-otp.controller'
import { UserOtpRepository } from './repositories/user-otp.repository'
import { UserOtpService } from './services/user-otp.service'

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      UserOtpRepository,
      UserRepository,
      UserWhitelistRepository
    ]),
    MailModule
  ],
  providers: [UserOtpService],
  controllers: [UserOtpController],
  exports: [UserOtpService]
})
export class UserOtpModule {}
