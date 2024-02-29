import { NotFoundException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { UserCode } from '../../databases/entities/user_code.entity'

@EntityRepository(UserCode)
export class UserCodeRepository extends Repository<UserCode> {
  async getById(id: number): Promise<UserCode> {
    const userOtp = await this.findOne(id)
    if (!userOtp) {
      throw new NotFoundException()
    }

    return userOtp
  }
}
