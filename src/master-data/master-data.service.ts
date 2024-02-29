import { Injectable } from '@nestjs/common'
import BigNumber from 'bignumber.js'
import { EntityManager } from 'typeorm'

import { calculateChangeBetweenNumber } from '../tracking/utils'

@Injectable()
export class MasterDataService {
  constructor(private readonly entityManager: EntityManager) {}

  async getResilienceByStat(stat: string): Promise<string> {
    const masterDataRe = await this.entityManager
      .createQueryBuilder()
      .from('m_resilience', 're')
      .where('re.stat >= :stat', {
        stat: new BigNumber(stat).toFixed(0, BigNumber.ROUND_DOWN)
      })
      .orderBy('re.stat', 'ASC')
      .limit(2)
      .getRawMany()
    if (!masterDataRe.length) {
      const masterDataRe = await this.entityManager
        .createQueryBuilder()
        .from('m_resilience', 're')
        .where('re.stat < :stat', { stat })
        .orderBy('re.stat', 'DESC')
        .getRawOne()
      return masterDataRe.durability
    }
    return calculateChangeBetweenNumber(
      new BigNumber(stat),
      new BigNumber(masterDataRe[0]?.durability),
      new BigNumber(masterDataRe[1]?.durability)
    )
  }

  async getEfficiencyByLevel(level: string): Promise<string> {
    const mDataEff = await this.entityManager
      .createQueryBuilder()
      .from('m_eff', 'ef')
      .where('ef.level >= :stat', {
        stat: new BigNumber(level).toFixed(0, BigNumber.ROUND_DOWN)
      })
      .orderBy('ef.level', 'ASC')
      .limit(2)
      .getRawMany()
    if (!mDataEff.length) {
      const masterDataRe = await this.entityManager
        .createQueryBuilder()
        .from('m_eff', 'ef')
        .where('ef.level < :stat', { stat: level })
        .orderBy('ef.level', 'DESC')
        .getRawOne()
      return masterDataRe.durability
    }
    return calculateChangeBetweenNumber(
      new BigNumber(level),
      new BigNumber(mDataEff[0]?.earn),
      new BigNumber(mDataEff[1]?.earn)
    )
  }

  async getBonusPercentByStat(stat: string): Promise<string> {
    const mDataBonus = await this.entityManager
      .createQueryBuilder()
      .from('m_bonus', 'bo')
      .where('bo.stat >= :stat', {
        stat: new BigNumber(stat).toFixed(0, BigNumber.ROUND_DOWN)
      })
      .orderBy('bo.stat', 'ASC')
      .limit(2)
      .getRawMany()
    if (!mDataBonus.length) {
      const masterDataRe = await this.entityManager
        .createQueryBuilder()
        .from('m_bonus', 'bo')
        .where('bo.stat < :stat', { stat })
        .orderBy('bo.stat', 'DESC')
        .getRawOne()
      return masterDataRe.durability
    }
    return calculateChangeBetweenNumber(
      new BigNumber(stat),
      new BigNumber(mDataBonus[0].percent_increase),
      new BigNumber(mDataBonus[1].percent_increase)
    )
  }
}
