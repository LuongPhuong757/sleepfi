import { NotFoundException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { EntityManager } from 'typeorm/entity-manager/EntityManager'

import { User } from '../../databases/entities/user.entity'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getById(id: number): Promise<User> {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  getSpendingBalances(id: number) {
    const qb = this.createQueryBuilder('users')
      .leftJoin('spending_balances', 'sb', 'sb.user_id = users.id')
      .select([
        'sb.symbol',
        'sb.amount',
        'sb.available_amount',
        'users.wallet',
        'users.email'
      ])
      .where(`users.id = :id`, { id })

    return qb.getRawOne()
  }
}
