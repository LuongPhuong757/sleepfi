import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserRepository } from '../user/repositories/user.repository'
import { UserWhitelistController } from './user-whitelist.controller'
import { UserWhitelistRepository } from './user-whitelist.repository'
import { UserWhitelistSevice } from './user-whitelist.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWhitelistRepository, UserRepository])
  ],
  controllers: [UserWhitelistController],
  providers: [UserWhitelistSevice]
})
export class UserWhitelistModule {}
