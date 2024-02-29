import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserRepository } from '../user/repositories/user.repository'
import { AutogenerateCodeJob } from './autogenerate-code.job'
import { UserCodeRepository } from './repositories/user-code.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserCodeRepository, UserRepository])],
  providers: [AutogenerateCodeJob, ConfigService]
})
export class UserCodeModule {}
