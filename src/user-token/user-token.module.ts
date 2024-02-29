import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserTokenController } from './user-token.controller'
import { UserTokenRepository } from './user-token.repository'
import { UserTokenService } from './user-token.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserTokenRepository])],
  providers: [UserTokenService],
  controllers: [UserTokenController],
  exports: [UserTokenService]
})
export class UserTokenModule {}
