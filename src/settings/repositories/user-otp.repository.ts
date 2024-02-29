import { NotFoundException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { Settings } from '../../databases/entities/settings.entity'

@EntityRepository(Settings)
export class SettingsRepository extends Repository<Settings> {
  async getById(id: number): Promise<Settings> {
    const userOtp = await this.findOne(id)
    if (!userOtp) {
      throw new NotFoundException()
    }

    return userOtp
  }
}
