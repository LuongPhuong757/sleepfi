import { NotFoundException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { Tracking } from '../../databases/entities/tracking.entity'

@EntityRepository(Tracking)
export class TrackingRepository extends Repository<Tracking> {
  async getById(id: number): Promise<Tracking> {
    const tracking = await this.findOne(id)
    if (!tracking) {
      throw new NotFoundException()
    }

    return tracking
  }
}
