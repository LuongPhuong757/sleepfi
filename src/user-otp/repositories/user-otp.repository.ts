import { NotFoundException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { UserOtp } from '../../databases/entities/user_otp.entity'

@EntityRepository(UserOtp)
export class UserOtpRepository extends Repository<UserOtp> {
  async getById(id: number): Promise<UserOtp> {
    const userOtp = await this.findOne(id)
    if (!userOtp) {
      throw new NotFoundException()
    }

    return userOtp
  }
}
