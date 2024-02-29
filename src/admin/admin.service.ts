import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import MsgHelper from 'src/common/MessageUtils'
import { StackingSetting } from 'src/databases/entities/stacking_setting.entity'
import {
  COST_OPEN_GACHA,
  DEFAULT_COST_OPEN_GACHA,
  GACHA_CONFIG_KEY,
  GACHA_TYPE,
  NFT_TYPE_BY_CATEGORY,
  PROBABILITY_GACHA
} from 'src/gacha/constant'
import { GachaProbConfigRepository } from 'src/gacha/gacha-prob-config.repository'
import { GachaResultRepository } from 'src/gacha/user-gacha-result.repository'
import { StatusStacking, TOKEN_SYMBOL } from 'src/stack_details/enum'
import { In, Repository } from 'typeorm'

import { GachaProbConfig } from '../databases/entities/gacha_prob_config.entity'
import { StackDetails } from '../databases/entities/stack_details.entity'
import { User } from '../databases/entities/user.entity'
import { CLASS } from '../nfts/constants'
import { TrackingRepository } from '../tracking/repositories/tracking.repository'
import {
  ACTION_TARGET_TYPE,
  ACTION_TYPE,
  KPI_TYPE
} from '../tx-history/constant'
import { TxHistoryRepository } from '../tx-history/tx-history.repository'
import { ResGetAddPointTimes, ResTrackingByBedType } from './constants'
import { GachaCostDto } from './dtos/gacha-cost.dto'
import { GachaProbDto } from './dtos/gacha-prob.dto'
import { GachaResetTimeDto } from './dtos/gacha-reset-time.dto'
import { StackingSettingInput } from './dtos/stacking-setting-input.dto'

@Injectable()
export class AdminService {
  constructor(
    private readonly trackingRepository: TrackingRepository,
    private readonly txHistoryRepo: TxHistoryRepository,
    private readonly gachaResultRepo: GachaResultRepository,
    private readonly gachaProbConfigRepo: GachaProbConfigRepository,
    @InjectRepository(StackDetails)
    private stackDetailsRepository: Repository<StackDetails>
  ) { }

  async getTotal() {
    const result = await this.txHistoryRepo
      .createQueryBuilder('c')
      .select([
        'c.target_type as target_type',
        'c.type as type',
        'sum(c.amount) as total'
        //  'sum(ifnull(c.insurance,0)) as insurance'
      ])
      .where('c.type IN (:...type)', {
        type: Object.values(ACTION_TYPE)
      })
      .andWhere('c.symbol = :token', { token: TOKEN_SYMBOL.toLowerCase() })
      .groupBy('c.target_type')
      .addGroupBy('c.type')
      .getRawMany()

    const insurance = await this.txHistoryRepo
      .createQueryBuilder('c')
      .select('sum(ifnull(c.insurance,0)) as insurance')
      .getRawOne()

    return {
      totalBurn: {
        bed: [
          {
            type: ACTION_TYPE.MINT,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.MINT &&
                  (item.target_type == ACTION_TARGET_TYPE.BED ||
                    item.target_type == ACTION_TARGET_TYPE.BED_BOX)
                )
                  return item
              })?.total || 0
          },
          {
            type: ACTION_TYPE.REPAIR,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.REPAIR &&
                  item.target_type == ACTION_TARGET_TYPE.BED
                )
                  return item
              })?.total || 0
          },
          {
            type: ACTION_TYPE.LEVEL_UP,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.LEVEL_UP &&
                  item.target_type == ACTION_TARGET_TYPE.BED
                )
                  return item
              })?.total || 0
          },
          {
            type: ACTION_TYPE.RECYCLING,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.RECYCLING &&
                  item.target_type == ACTION_TARGET_TYPE.BED
                )
                  return item
              })?.total || 0
          }
        ],
        jewel: [
          {
            type: ACTION_TYPE.MINT,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.MINT &&
                  item.target_type == ACTION_TARGET_TYPE.JEWEL
                )
                  return item
              })?.total || 0
          },
          {
            type: ACTION_TYPE.LEVEL_UP,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.LEVEL_UP &&
                  item.target_type == ACTION_TARGET_TYPE.JEWEL
                )
                  return item
              })?.total || 0
          },
          {
            type: ACTION_TYPE.REMOVE_JEWEL,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.REMOVE_JEWEL &&
                  item.target_type == ACTION_TARGET_TYPE.JEWEL
                )
                  return item
              })?.total || 0
          }
        ],
        item: [
          {
            type: ACTION_TYPE.MINT,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.MINT &&
                  item.target_type == ACTION_TARGET_TYPE.JEWEL
                )
                  return item
              })?.total || 0
          },
          {
            type: ACTION_TYPE.BUY,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.BUY &&
                  item.target_type == ACTION_TARGET_TYPE.JEWEL
                )
                  return item
              })?.total || 0
          }
        ],
        lucky_box: [
          {
            type: ACTION_TYPE.OPEN_LUCK_BOX,
            total:
              result.find((item) => {
                if (
                  item.type == ACTION_TYPE.OPEN_LUCK_BOX &&
                  item.target_type == ACTION_TARGET_TYPE.LUCKY_BOX
                )
                  return item
              })?.total || 0
          }
        ],
        insurance: insurance.insurance
      }
    }
  }

  async getAttributesAddTimes(): Promise<ResGetAddPointTimes> {
    const addPointRecord = await this.txHistoryRepo.find({
      where: {
        type: ACTION_TYPE.ADD_POINT
      }
    })

    const data = {}

    addPointRecord
      .map((e) => e.metaData)
      .forEach((meta) => {
        _.forEach(meta, (value, key) => {
          if (new BigNumber(value).gt(0)) {
            data[key] = data[key] ? data[key] + 1 : 1
          }
        })
      })
    return data
  }

  async getInitialSalesNft() {
    const INITIAL_NFT = 30000
    const result = await this.txHistoryRepo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.nftSale', 'sale', 'sale.id = tx.nftSaleId')
      .where('tx.type = :type AND tx.nftId <= :genesisNft', {
        type: ACTION_TYPE.BUY,
        genesisNft: INITIAL_NFT
      })
      .getMany()

    return {
      totalSale: result.length,
      totalFee: result
        .reduce((a, b) => {
          const transactionFee = b.nftSale
            ? new BigNumber(b.nftSale.transactionsFee).div(100).times(b.amount)
            : 0
          return a.plus(transactionFee)
        }, new BigNumber(0))
        .toString()
    }
  }

  async countTrackingByBedType(): Promise<ResTrackingByBedType[]> {
    const result = await this.trackingRepository
      .createQueryBuilder('t')
      .select(['t.bedType as bedType', 't.userId as userId'])
      .groupBy('bedType')
      .addGroupBy('userId')
      .getRawMany()
    return [
      {
        bedType: CLASS.SHORT,
        usedUsers: result.filter((e) => e.bedType === CLASS.SHORT).length
      },
      {
        bedType: CLASS.MIDDLE,
        usedUsers: result.filter((e) => e.bedType === CLASS.MIDDLE).length
      },
      {
        bedType: CLASS.LONG,
        usedUsers: result.filter((e) => e.bedType === CLASS.LONG).length
      },
      {
        bedType: CLASS.FLEXIBLE,
        usedUsers: result.filter((e) => e.bedType === CLASS.FLEXIBLE).length
      }
    ]
  }

  async countActiveNumberSection() {
    const txHistory = await this.txHistoryRepo
      .createQueryBuilder('c')
      .select([
        'c.userId as userId',
        'c.type as type',
        'target_type as targetType'
      ])
      .where('c.type IN (:...type)', {
        type: [
          ACTION_TYPE.DEPOSIT_TOKEN,
          ACTION_TYPE.WITHDRAW_TOKEN,
          ACTION_TYPE.DEPOSIT_NFT,
          ACTION_TYPE.WITHDRAW_NFT,
          ACTION_TYPE.BUY,
          ACTION_TYPE.SELL,
          ACTION_TYPE.MINT,
          ACTION_TYPE.REPAIR,
          ACTION_TYPE.LEVEL_UP,
          ACTION_TYPE.RECYCLING,
          ACTION_TYPE.REMOVE_JEWEL
        ]
      })
      .groupBy('c.type')
      .addGroupBy('c.userId')
      .addGroupBy('targetType')
      .getRawMany()

    const stakeDetails = await this.stackDetailsRepository
      .createQueryBuilder('c')
      .select([
        'count(distinct user_id) as usedUsers',
        'status_stacking as type'
      ])
      .groupBy('type')
      .getRawMany()

    const historyBed = txHistory.filter(
      (e) => e.targetType === ACTION_TARGET_TYPE.BED
    )
    const historyJewel = txHistory.filter(
      (e) => e.targetType === ACTION_TARGET_TYPE.JEWEL
    )
    const historyItem = txHistory.filter(
      (e) => e.targetType === ACTION_TARGET_TYPE.ITEM
    )

    return {
      activeUser: [
        {
          type: ACTION_TYPE.BUY,
          usedUsers: txHistory.filter((e) => e.type === ACTION_TYPE.BUY).length
        },
        {
          type: ACTION_TYPE.SELL,
          usedUsers: txHistory.filter((e) => e.type === ACTION_TYPE.SELL).length
        },
        {
          type: KPI_TYPE.WALLET_WITHDRAW,
          usedUsers: txHistory.filter(
            (e) =>
              e.type === ACTION_TYPE.WITHDRAW_TOKEN ||
              e.type === ACTION_TYPE.WITHDRAW_NFT
          ).length
        },
        {
          type: KPI_TYPE.WALLET_DEPOSIT,
          usedUsers: txHistory.filter(
            (e) =>
              e.type === ACTION_TYPE.DEPOSIT_TOKEN ||
              e.type === ACTION_TYPE.DEPOSIT_NFT
          ).length
        },
        {
          type: KPI_TYPE.STAKING_DEPOSIT,
          usedUsers:
            +stakeDetails.find((e) => e.type === StatusStacking.STAKE)
              ?.usedUsers || 0
        },
        {
          type: KPI_TYPE.STAKING_WITHDRAW,
          usedUsers:
            +stakeDetails.find((e) => e.type === StatusStacking.UNSTAKE)
              ?.usedUsers || 0
        }
      ],
      bed: [
        {
          type: ACTION_TYPE.MINT,
          usedUsers: historyBed.filter((e) => e.type === ACTION_TYPE.MINT)
            .length
        },
        {
          type: ACTION_TYPE.REPAIR,
          usedUsers: historyBed.filter((e) => e.type === ACTION_TYPE.REPAIR)
            .length
        },
        {
          type: ACTION_TYPE.LEVEL_UP,
          usedUsers: historyBed.filter((e) => e.type === ACTION_TYPE.LEVEL_UP)
            .length
        },
        {
          type: ACTION_TYPE.RECYCLING,
          usedUsers: historyBed.filter((e) => e.type === ACTION_TYPE.RECYCLING)
            .length
        }
      ],
      jewel: [
        {
          type: ACTION_TYPE.MINT,
          usedUsers: historyJewel.filter((e) => e.type === ACTION_TYPE.MINT)
            .length
        },
        {
          type: ACTION_TYPE.LEVEL_UP,
          usedUsers: historyJewel.filter((e) => e.type === ACTION_TYPE.LEVEL_UP)
            .length
        },
        {
          type: ACTION_TYPE.REMOVE_JEWEL,
          usedUsers: historyJewel.filter(
            (e) => e.type === ACTION_TYPE.REMOVE_JEWEL
          ).length
        }
      ],
      item: [
        {
          type: ACTION_TYPE.MINT,
          usedUsers: historyItem.filter((e) => e.type === ACTION_TYPE.MINT)
            .length
        },
        {
          type: ACTION_TYPE.BUY,
          usedUsers: historyItem.filter((e) => e.type === ACTION_TYPE.BUY)
            .length
        }
      ]
    }
  }

  async getGachaInfo(type: string) {
    let getAllGachaResultInfo = await this.gachaResultRepo
      .createQueryBuilder('g')
      .select(['g.user_id', 'g.gacha_type', 'g.tx_id'])
      .orderBy('g.id', 'ASC')
      .getRawMany()

    // when data is empty
    if (
      !getAllGachaResultInfo ||
      (getAllGachaResultInfo && getAllGachaResultInfo.length === 0)
    ) {
      return {
        status: 'success',
        data: []
      }
    }

    getAllGachaResultInfo =
      type === 'user'
        ? _.uniqBy(getAllGachaResultInfo, 'tx_id')
        : getAllGachaResultInfo
    const ngSingle = getAllGachaResultInfo.filter(
      (e) => e.gacha_type === GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_SINGLE]
    )
    const ngMul = getAllGachaResultInfo.filter(
      (e) =>
        e.gacha_type === GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE]
    )
    const sgSingle = getAllGachaResultInfo.filter(
      (e) => e.gacha_type === GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_SINGLE]
    )
    const sgMul = getAllGachaResultInfo.filter(
      (e) =>
        e.gacha_type === GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_MULTIPLE]
    )

    if (type === 'user') {
      return {
        activeUser: [
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_SINGLE],
            usedUsers: _.uniqBy(ngSingle, 'user_id').length ?? 0
          },
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE],
            usedUsers: _.uniqBy(ngMul, 'user_id').length ?? 0
          },
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_SINGLE],
            usedUsers: _.uniqBy(sgSingle, 'user_id').length ?? 0
          },
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_MULTIPLE],
            usedUsers: _.uniqBy(sgMul, 'user_id').length ?? 0
          }
        ]
      }
    }

    if (type === 'token') {
      // get config from database
      const getConfig = await this.gachaProbConfigRepo
        .createQueryBuilder()
        .getMany()

      // get cost to spin gacha
      let costDefault = DEFAULT_COST_OPEN_GACHA
      if (getConfig.length) {
        const findConfigCommon = getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.COST_OPEN_GACHA
        )?.value
        costDefault = findConfigCommon
          ? JSON.parse(findConfigCommon)
          : costDefault
      }

      return {
        activeUser: [
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_SINGLE],
            slft_used: `${new BigNumber(ngSingle.length)
                .times(
                  costDefault[GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_SINGLE]]
                )
                .toString() ?? 0
              } SLFT`
          },
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE],
            slft_used: `${new BigNumber(ngMul.length)
                .times(
                  costDefault[
                  GACHA_TYPE[PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE]
                  ]
                )
                .toString() ?? 0
              } SLFT`
          },
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_SINGLE],
            slft_used: `${new BigNumber(sgSingle.length)
                .times(
                  costDefault[
                  GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_SINGLE]
                  ]
                )
                .toString() ?? 0
              } SLFT`
          },
          {
            type: GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_MULTIPLE],
            slft_used: `${new BigNumber(sgMul.length)
                .times(
                  costDefault[
                  GACHA_TYPE[PROBABILITY_GACHA.SPECIAL_GACHA_MULTIPLE]
                  ]
                )
                .toString() ?? 0
              } SLFT`
          }
        ]
      }
    }
  }

  async getGachaProbSetting(): Promise<GachaProbConfig[]> {
    return await this.gachaProbConfigRepo.find()
  }

  async setGachaProByType(dto: GachaProbDto): Promise<GachaProbConfig> {
    // const formattedData = dto.value.map((e: any) => {
    //   e.category = _.find(NFT_TYPE_BY_CATEGORY, (i) => i === e.type)
    //   return e;
    // })
    await this.gachaProbConfigRepo.update(
      {
        key: dto.key
      },
      {
        value: JSON.stringify(dto.value)
      }
    )
    return this.gachaProbConfigRepo.findOne({
      where: {
        key: dto.key
      }
    })
  }

  async setCostOpenGacha(dto: GachaCostDto): Promise<GachaProbConfig> {
    await this.gachaProbConfigRepo.update(
      {
        key: GACHA_CONFIG_KEY.COST_OPEN_GACHA
      },
      {
        value: JSON.stringify({
          [COST_OPEN_GACHA['1']]: dto.normalGachaSingle,
          [COST_OPEN_GACHA['2']]: dto.normalGachaMultiple,
          [COST_OPEN_GACHA['3']]: dto.specialGachaSingle,
          [COST_OPEN_GACHA['4']]: dto.specialGachaMultiple
        })
      }
    )
    return this.gachaProbConfigRepo.findOne({
      where: {
        key: GACHA_CONFIG_KEY.COST_OPEN_GACHA
      }
    })
  }

  async settingResetTime(dto: GachaResetTimeDto): Promise<GachaProbConfig[]> {
    if (dto.commonResetTime) {
      await this.gachaProbConfigRepo.update(
        {
          key: GACHA_CONFIG_KEY.COMMON_RESET_TIME
        },
        {
          value: JSON.stringify({
            times: dto.commonResetTime
          })
        }
      )
    }
    if (dto.specialResetTime) {
      await this.gachaProbConfigRepo.update(
        {
          key: GACHA_CONFIG_KEY.SPECIAL_RESET_TIME
        },
        {
          value: JSON.stringify({
            times: dto.specialResetTime
          })
        }
      )
    }
    return this.gachaProbConfigRepo.find({
      where: {
        key: In([
          GACHA_CONFIG_KEY.COMMON_RESET_TIME,
          GACHA_CONFIG_KEY.SPECIAL_RESET_TIME
        ])
      }
    })
  }

  async addStakingSetting(user: User, payload: StackingSettingInput) {
    try {
      const checkUser = await User.findOne({ id: user.id })

      let stackingSetting = await StackingSetting.findOne()
      const { earningTokens, mintingDiscount, levelUpDiscount } = payload
      if (!stackingSetting) {
        stackingSetting = new StackingSetting()
      }
      stackingSetting.earningTokens = earningTokens
        ? JSON.stringify(earningTokens)
        : stackingSetting.earningTokens
      stackingSetting.levelUpDiscount = levelUpDiscount
        ? JSON.stringify(levelUpDiscount)
        : stackingSetting.levelUpDiscount
      stackingSetting.mintingDiscount = mintingDiscount
        ? JSON.stringify(mintingDiscount)
        : stackingSetting.mintingDiscount
      return await stackingSetting.save()
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
