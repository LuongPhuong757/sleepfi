import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import moment from 'moment'
import { Brackets } from 'typeorm'

import { makeId } from '../common/UserCode'
import { UserCode } from '../databases/entities/user_code.entity'
import { UserRepository } from '../user/repositories/user.repository'
import { UserCodeRepository } from './repositories/user-code.repository'

@Injectable()
export class AutogenerateCodeJob {
  constructor(
    private readonly userCodeRepository: UserCodeRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleChangeUsedCodeEveryDay(): Promise<void> {
    const isEnableAutoGenerateUserCode = this.configService.get<number>(
      'isEnableAutoGenUserCode'
    )
    if (!isEnableAutoGenerateUserCode) {
      return
    }
    const today = moment().format('YYYY-MM-DD')
    const userIdCreatedId = await this.userCodeRepository
      .createQueryBuilder('uc')
      .select('uc.userId as userId')
      .where('DATE(uc.createdAt) = :today', { today })
      .groupBy('userId')
      .getRawMany()
    const queryUserIdHaveLessThan3 = this.userRepository
      .createQueryBuilder('u')
      .select(['u.id as userId', 'count(uc.id) as validCodeCount'])
      .leftJoin(UserCode, 'uc', 'u.id = uc.userId')
      .where(
        new Brackets((qb) => {
          qb.where('uc.isUsed = 0').orWhere('uc.isUsed IS NULL')
        })
      )
      .groupBy('userId')
      .having('validCodeCount < 3')
    if (userIdCreatedId.length) {
      queryUserIdHaveLessThan3.andWhere('u.id NOT IN (:...userIds)', {
        userIds: userIdCreatedId.map((e) => e.userId)
      })
    }
    const userIdHaveLessThan3 = await queryUserIdHaveLessThan3.getRawMany()
    if (userIdHaveLessThan3.length) {
      const addNewCode = []
      userIdHaveLessThan3.forEach((e) => {
        const activeCode = new UserCode()
        activeCode.userId = e.userId
        activeCode.code = this._generateActiveCode(e.userId)
        activeCode.isUsed = false
        addNewCode.push(activeCode)
      })
      if (addNewCode) {
        await this.userCodeRepository.insert(addNewCode)
      }
    }
  }

  private _generateActiveCode(userId): string {
    return makeId() + `${userId}`
  }
}
