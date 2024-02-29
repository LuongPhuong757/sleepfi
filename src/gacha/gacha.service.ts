import { BadRequestException, Injectable } from '@nestjs/common'
import BigNumber from 'bignumber.js'
import { plainToClass } from "class-transformer";
import {
  ATTRIBUTE_EFFECT,
  BED_QUALITY,
  ITEMS_TYPE_PERCENT,
  JEWELS_TYPE_PERCENT,
  PATH_IMG
} from 'crawler/constants/attributes'
import { genNftAttributeJson } from 'crawler/MintNft'
import {
  COMMON_BED_CLASS_NFT,
  COMMON_BED_NORMAL_MAIN_NET,
  NORMAL_GACHA_MAIN_NET,
  NORMAL_GACHA_TEST_NET,
  SPECIAL_GACHA_MAIN_NET,
  SPECIAL_GACHA_TEST_NET,
  UNCOMMON_BED_NORMAL_MAIN_NET
} from 'src/common/GachaGift'
import { getRandomWithPercent } from 'src/common/LuckyBox'
import MsgHelper from 'src/common/MessageUtils'
import { getLevel } from 'src/common/Utils'
import { GachaProbConfig } from 'src/databases/entities/gacha_prob_config.entity'
import { NftAttributes } from 'src/databases/entities/nft_attributes.entity'
import { NftLevelUp } from 'src/databases/entities/nft_level_up.entity'
import { Nfts } from 'src/databases/entities/nfts.entity'
import { SpendingBalances } from 'src/databases/entities/spending_balances.entity'
import { UserGachaInfo } from 'src/databases/entities/user_gacha_info.entity'
import { UserGachaResult } from 'src/databases/entities/user_gacha_result.entity'
import { HealthAppDataRepository } from 'src/health-app-data/health-app-data.repository'
import { getPercentItemLevel, getPercentJewelLevel } from 'src/master-data/constants'
import { NftAttributesSevice } from 'src/nft-attributes/nft-attributes.service'
import { CATEGORY_TYPE, NFT_LEVEL_UP_STATUS, NFT_TYPE_ATTRIBUTES } from 'src/nfts/constants'
import { PROFIT_TYPE } from 'src/profit/constants';
import { ProfitSevice } from 'src/profit/profit.service';
import { SpendingBalancesRepository } from 'src/spending_balances/spending_balances.repository'
import { SpendingBalancesSevice } from 'src/spending_balances/spending_balances.service';
import { TOKEN_SYMBOL } from 'src/stack_details/enum'
import { ACTION_TYPE } from 'src/tx-history/constant'
import { TxHistorySevice } from 'src/tx-history/tx-history.service'
import { Connection } from 'typeorm'
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { v4 as uuidv4 } from 'uuid'

import { User } from '../databases/entities/user.entity'
import {
  COMMON_RESET_TIME,
  COST_OPEN_GACHA,
  DEFAULT_COST_OPEN_GACHA,
  GACHA_ANIMATION,
  GACHA_ANIMATION_ENUM,
  GACHA_CONFIG_KEY,
  GACHA_TYPE,
  NFT_TYPE_BY_CATEGORY,
  PROBABILITY_GACHA,
  SPECIAL_RESET_TIME
} from './constant'
import { UserSpinGachaDto } from './dtos/user-spin-gacha.dto'
import { GachaProbConfigRepository } from './gacha-prob-config.repository'
import { UserGachaInfoRepository } from './user-gacha-info.repository'
import { GachaResultRepository } from './user-gacha-result.repository'

export interface RESULT_SINGLE_GACHA {
  type: string
  attributes: any
}

export interface RESULT_MULTILE_GACHA {
  type: string
  attributes: any
}

export interface RESULT_GACHA {
  status: string
  gift: RESULT_GACHA | Array<RESULT_MULTILE_GACHA>
}

@Injectable()
export class GachaSevice {
  private NORMAL_GACHA
  private SPECIAL_GACHA

  constructor(
    private readonly gachaResultRepo: GachaResultRepository,
    private readonly heathAppRepo: HealthAppDataRepository,
    private readonly spendingBalanceRepo: SpendingBalancesRepository,
    private readonly userGachaInfoRepo: UserGachaInfoRepository,
    private readonly gachaProbConfigRepo: GachaProbConfigRepository,
    private readonly nftAttService: NftAttributesSevice,
    private readonly txHistoryService: TxHistorySevice,
    private readonly profitSevice: ProfitSevice,
    private readonly spendingBalancesSevice: SpendingBalancesSevice,
    private connection: Connection
  ) {
    this.NORMAL_GACHA = Boolean(Number(process.env.GACHA_MAINNET_ENV))
      ? NORMAL_GACHA_MAIN_NET
      : NORMAL_GACHA_TEST_NET
    this.SPECIAL_GACHA = Boolean(Number(process.env.GACHA_MAINNET_ENV))
      ? SPECIAL_GACHA_MAIN_NET
      : SPECIAL_GACHA_TEST_NET

  }

  async spin(dto: UserSpinGachaDto, user: User) {
    const resultData = {
      status: 'success',
      gift: [],
      animation: 'Normal'
    }

    // get config from database
    const getConfig = await this.gachaProbConfigRepo
      .createQueryBuilder()
      .getMany()
    let nGacha = this.NORMAL_GACHA
    let spGacha = this.SPECIAL_GACHA
    let costDefault = DEFAULT_COST_OPEN_GACHA[dto.probability]
    if (getConfig.length) {
      // get db config gacha_prob_config
      const findConfigCommon = getConfig.find(
        (x) => x.key === GACHA_CONFIG_KEY.COST_OPEN_GACHA
      )?.value
      const nGachaConfig = Boolean(Number(process.env.GACHA_MAINNET_ENV))
        ? getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.NORMAL_GACHA_MAIN_NET
        )?.value
        : getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.NORMAL_GACHA_TEST_NET
        )?.value
      const spGachaConfig = Boolean(Number(process.env.GACHA_MAINNET_ENV))
        ? getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.SPECIAL_GACHA_MAIN_NET
        )?.value
        : getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.SPECIAL_GACHA_TEST_NET
        )?.value

      // set data config
      costDefault = findConfigCommon
        ? JSON.parse(findConfigCommon)[COST_OPEN_GACHA[dto.probability]]
        : costDefault
      nGacha = JSON.parse(nGachaConfig)
      spGacha = JSON.parse(spGachaConfig)
    }

    // gen gacha
    const times =
      dto.probability === PROBABILITY_GACHA.NORMAL_GACHA_SINGLE ||
        dto.probability === PROBABILITY_GACHA.SPECIAL_GACHA_SINGLE
        ? 1
        : 10
    const pList =
      dto.probability == PROBABILITY_GACHA.NORMAL_GACHA_SINGLE ||
        dto.probability === PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE
        ? nGacha
        : spGacha

    // get wallet from user inside database
    const userWallet = await this.spendingBalanceRepo.manager
      .getRepository(User)
      .findOne({
        id: user.id
      })

    if (!userWallet || (userWallet && !userWallet.wallet)) {
      throw new BadRequestException(MsgHelper.MsgList.insufficient_balance)
    }

    // gift slft
    resultData.gift = await this.createGachaList(
      user.id,
      times,
      dto.probability,
      costDefault,
      userWallet.wallet,
      pList
    )

    // get animation
    const animationRd = await this.getAnimation(resultData.gift, getConfig)
    resultData.animation = animationRd
    return resultData
  }

  async getProbConfig() {
    const configs = await this.gachaProbConfigRepo
      .createQueryBuilder('gb')
      .getMany()

    const dataMapping = configs.map((x) => {
      return {
        key: x.key,
        config: x.value ? JSON.parse(x.value) : ''
      }
    })

    const configData = []
    const commonSpecialConfig = Boolean(Number(process.env.GACHA_MAINNET_ENV))
      ? dataMapping.find((x) => x.key === GACHA_CONFIG_KEY.PRO_NORMAL_MAIN_NET)
        .config
      : dataMapping.find((x) => x.key === GACHA_CONFIG_KEY.PRO_NORMAL_TEST_NET)
        .config
    const probabilitySpecialConfig = Boolean(
      Number(process.env.GACHA_MAINNET_ENV)
    )
      ? dataMapping.find((x) => x.key === GACHA_CONFIG_KEY.PRO_SPECIAL_MAIN_NET)
        .config
      : dataMapping.find((x) => x.key === GACHA_CONFIG_KEY.PRO_SPECIAL_TEST_NET)
        .config
    configData.push({
      key: GACHA_CONFIG_KEY.COMMON,
      configs: commonSpecialConfig
    })

    configData.push({
      key: GACHA_CONFIG_KEY.SPECIAL,
      configs: probabilitySpecialConfig
    })

    configData.push({
      key: GACHA_CONFIG_KEY.COMMON_RESET_TIME,
      configs: dataMapping.find(
        (x) => x.key === GACHA_CONFIG_KEY.COMMON_RESET_TIME
      ).config
    })

    configData.push({
      key: GACHA_CONFIG_KEY.SPECIAL_RESET_TIME,
      configs: dataMapping.find(
        (x) => x.key === GACHA_CONFIG_KEY.SPECIAL_RESET_TIME
      ).config
    })

    configData.push({
      key: GACHA_CONFIG_KEY.COST_OPEN_GACHA,
      configs: dataMapping.find(
        (x) => x.key === GACHA_CONFIG_KEY.COST_OPEN_GACHA
      ).config
    })
    return {
      status: 'success',
      data: configData
    }
  }

  async createGachaList(
    userId: number,
    spins: number,
    prob: number,
    cost: number,
    userWallet: string,
    pList: any
  ) {
    let resultData = []
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const giftLst = []
      pList = pList.sort((x, y) => {
        return x.percent - y.percent
      })

      for (let i = 0; i < spins; i++) {
        const p = await getRandomWithPercent(pList)
        const objEarn = pList.find((x) => x.value === p)
        giftLst.push(objEarn)
      }

      // get sum all total slft which user can earn
      const restSLFTLst = giftLst
        .filter((x) => x.type.toLowerCase() === TOKEN_SYMBOL.toLowerCase())
        .map((x) => {
          return {
            type: TOKEN_SYMBOL.toLowerCase(),
            amount: x.amount,
            frame_colour: x.frame_colour
          }
        })

      // const userBalance = await queryRunner.manager
      //   .getRepository(SpendingBalances)
      //   .createQueryBuilder('sb')
      //   .setLock('pessimistic_write')
      //   .where('sb.symbol = :symbol AND sb.userId = :userId', {
      //     symbol: TOKEN_SYMBOL.toLowerCase(),
      //     userId
      //   })
      //   .getOne()
      // if (!userBalance) {
      //   throw new BadRequestException(MsgHelper.MsgList.insufficient_balance)
      // }

      // const balance = new BigNumber(userBalance.amount)
      // const availableBalance = new BigNumber(userBalance.availableAmount)
      // if (!balance || !availableBalance || availableBalance.isLessThan(cost)) {
      //   throw new BadRequestException(MsgHelper.MsgList.insufficient_balance)
      // }

      // change balance user
      let totalSFLFT = 0
      if (restSLFTLst.length) {
        resultData = resultData.concat(restSLFTLst)
        totalSFLFT = restSLFTLst.map((x) => x.amount).reduce((a, b) => a + b)
      }

      // plus slft can be earn
      // const newBalance = new BigNumber(availableBalance.plus(totalSFLFT))
      //   .minus(cost)
      //   .toString()
      // const newavailableBalance = new BigNumber(balance.plus(totalSFLFT))
      //   .minus(cost)
      //   .toString()

      // plus cost for profit
      await this.profitSevice.processProfit(userId, TOKEN_SYMBOL.toLowerCase(), cost.toString(), PROFIT_TYPE.CREATE_GACHA, queryRunner.manager)
      const { beforeBalance, newBalance } = await this.spendingBalancesSevice.minusTokenWithQueryRunner(userId, cost, totalSFLFT, queryRunner.manager)
      // add history balance change
      await this.txHistoryService.addHistory({
        type: ACTION_TYPE[GACHA_TYPE[prob]],
        targetType: '',
        userId: userId,
        symbol: TOKEN_SYMBOL.toLowerCase(),
        amount: new BigNumber(totalSFLFT).plus(cost).toString(),
        nftId: null,
        tokenId: '',
        tokenAddress: process.env.SLFT_ADDRESS,
        beforeBalance: beforeBalance.toString(),
        currentBalance: newBalance
      })


      // userBalance.availableAmount = newBalance.toString()
      // userBalance.amount = newavailableBalance.toString()
      // queryRunner.manager.getRepository(SpendingBalances).save(userBalance)

      // add entity to table UserGachaInfoRepository
      let userGachaInfo = await queryRunner.manager
        .getRepository(UserGachaInfo)
        .findOne({
          where: {
            userId: userId
          }
        })

      // add new user gacha info
      if (!userGachaInfo) {
        userGachaInfo = UserGachaInfo.create()
        userGachaInfo.userId = userId
        userGachaInfo.commonTimes = 0
        userGachaInfo.specialTimes = 0
        userGachaInfo.totalCommonTimes = 0
        userGachaInfo.totalSpecialTimes = 0
      }
      if (
        prob == PROBABILITY_GACHA.NORMAL_GACHA_SINGLE ||
        prob === PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE
      ) {
        userGachaInfo.commonTimes += spins
        userGachaInfo.totalCommonTimes += spins
      } else {
        userGachaInfo.specialTimes += spins
        userGachaInfo.totalSpecialTimes += spins
      }
      await queryRunner.manager.getRepository(UserGachaInfo).save(userGachaInfo)

      // list nft can be earn
      const listNFTEarn = giftLst.filter(
        (x) => x.type.toLowerCase() !== TOKEN_SYMBOL.toLowerCase()
      )
      const tx_gacha = uuidv4()
      for (const item of listNFTEarn) {
        // save entity to ntfs table
        const nft = new Nfts()
        nft.categoryId = item.category
        nft.isLock = 0
        nft.status = 'DEFAULT'
        await queryRunner.manager.getRepository(Nfts).save(nft)

        // save entity to ntf attributes
        let type = ''
        let contract = ''
        let classNFT = ''
        let qualityNFT = ''

        if (item.category === CATEGORY_TYPE.BED) {
          type = NFT_TYPE_ATTRIBUTES.BEDS
          contract = process.env.BED_CONTRACT
          classNFT = await getRandomWithPercent(COMMON_BED_CLASS_NFT)

          // check mainnet version
          if (Boolean(Number(process.env.GACHA_MAINNET_ENV))) {
            // Common Bed(genesis) or Uncommon Bed(genesis)
            classNFT =
              item.value === 'COMMON_BED'
                ? BED_QUALITY.Common
                : BED_QUALITY.Uncommon

            // Common Bed（normal)
            if (
              (prob == PROBABILITY_GACHA.NORMAL_GACHA_SINGLE ||
                prob === PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE) &&
              item.value === 'COMMON_BED'
            ) {
              classNFT = await getRandomWithPercent(COMMON_BED_NORMAL_MAIN_NET)
              qualityNFT = BED_QUALITY.Common
            }

            // Uncommon Bed(normal)
            if (
              (prob == PROBABILITY_GACHA.NORMAL_GACHA_SINGLE ||
                prob === PROBABILITY_GACHA.NORMAL_GACHA_MULTIPLE) &&
              item.value === 'UNCOMMON_BED'
            ) {
              classNFT = await getRandomWithPercent(
                UNCOMMON_BED_NORMAL_MAIN_NET
              )
              qualityNFT = BED_QUALITY.Uncommon
            }
          }

          // check mainnet version
          if (!Boolean(Number(process.env.GACHA_MAINNET_ENV))) {
            qualityNFT =
              item.value === 'COMMON_BED'
                ? BED_QUALITY.Common
                : BED_QUALITY.Uncommon
          }
        }

        if (item.category === CATEGORY_TYPE.JEWEL) {
          type = await getRandomWithPercent(JEWELS_TYPE_PERCENT)
          contract = process.env.JEWEL_CONTRACT
        }
        if (item.category === CATEGORY_TYPE.ITEM) {
          type = await getRandomWithPercent(ITEMS_TYPE_PERCENT)
          contract = process.env.ITEM_CONTRACT
        }
        const tokenId = await this.nftAttService.getTokenIdByCategory(
          item.category,
          queryRunner.manager
        )
        const nftEntity = await genNftAttributeJson(
          item.category,
          nft.id,
          type,
          userWallet,
          contract,
          tokenId,
          item.level,
          qualityNFT
        )
        nftEntity.classNft = classNFT || nftEntity.classNft || ''
        nftEntity.quality = qualityNFT || nftEntity.quality || ''
        nftEntity.nftType = nftEntity.nftType
          ? nftEntity.nftType
          : NFT_TYPE_BY_CATEGORY[item.category]

        const totalPercentIncrease = {
          efficiency: 0,
          luck: 0,
          bonus: 0,
          special: 0,
          resilience: 0
        }

        if (item.category === CATEGORY_TYPE.JEWEL) {
          totalPercentIncrease[ATTRIBUTE_EFFECT[type]] = getPercentJewelLevel(
            nftEntity.level
          )
          nftEntity.efficiency = totalPercentIncrease.efficiency
          nftEntity.luck = totalPercentIncrease.luck
          nftEntity.bonus = totalPercentIncrease.bonus
          nftEntity.special = totalPercentIncrease.special
          nftEntity.resilience = totalPercentIncrease.resilience
        }
        if (item.category === CATEGORY_TYPE.ITEM) {
          totalPercentIncrease[ATTRIBUTE_EFFECT[type]] = getPercentItemLevel(
            nftEntity.level
          )
          nftEntity.efficiency = totalPercentIncrease.efficiency
          nftEntity.luck = totalPercentIncrease.luck
          nftEntity.bonus = totalPercentIncrease.bonus
          nftEntity.special = totalPercentIncrease.special
          nftEntity.resilience = totalPercentIncrease.resilience
        }

        // update ntf attributes
        await queryRunner.manager.getRepository(NftAttributes).save(nftEntity)
        nftEntity.image = `${PATH_IMG[nftEntity.nftType]}${nftEntity.image}`
        nftEntity['frame_colour'] = item.frame_colour
        resultData.push(nftEntity)

        //insert nft level up after having new bed
        if (item.category === CATEGORY_TYPE.BED) {
          const newNftLevelUp = new NftLevelUp()
          newNftLevelUp.bedId = nft.id
          newNftLevelUp.levelUpTime = await (
            await getLevel(item.level)
          ).level_time
          newNftLevelUp.status = NFT_LEVEL_UP_STATUS.PENDING
          await queryRunner.manager
            .getRepository(NftLevelUp)
            .save(newNftLevelUp)
        }

        // save entity to table gacha result
        const userGachaResult = UserGachaResult.create()
        userGachaResult.userId = userId
        userGachaResult.transactionId = tx_gacha
        userGachaResult.result = JSON.stringify(nftEntity)
        userGachaResult.gachaType = GACHA_TYPE[prob]
        await queryRunner.manager
          .getRepository(UserGachaResult)
          .save(userGachaResult)
      }

      await queryRunner.commitTransaction()
      return resultData
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getHistoryGacha(user: User) {
    const userGachaInfo = await this.userGachaInfoRepo.findOne({
      where: {
        userId: user.id
      }
    })

    return {
      status: 'success',
      data: userGachaInfo ? userGachaInfo : null
    }
  }

  async getFreeBedGacha(userId: number, userWallet: string, typeGet: string) {
    // get wallet from user inside database
    const walletInfo = await this.connection.manager
      .getRepository(User)
      .findOne({
        id: userId
      })

    if (!walletInfo || (walletInfo && !walletInfo.wallet)) {
      throw new BadRequestException(MsgHelper.MsgList.insufficient_balance)
    }

    // create transaction gen gifts
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      // get config
      const getConfig = await queryRunner.manager
        .getRepository(GachaProbConfig)
        .createQueryBuilder()
        .getMany()
      let commonReset: any = COMMON_RESET_TIME
      let specialReset = SPECIAL_RESET_TIME
      if (getConfig) {
        const findConfigCommon = getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.COMMON_RESET_TIME
        )?.value
        const findConfigSpecial = getConfig.find(
          (x) => x.key === GACHA_CONFIG_KEY.COMMON_RESET_TIME
        )?.value
        commonReset = findConfigCommon
          ? JSON.parse(findConfigCommon)['times']
          : COMMON_RESET_TIME
        specialReset = findConfigSpecial
          ? JSON.parse(findConfigSpecial)['times']
          : COMMON_RESET_TIME
      }

      // add entity to table UserGachaInfoRepository
      const userGachaInfo = await queryRunner.manager
        .getRepository(UserGachaInfo)
        .findOne({
          where: {
            userId: userId
          }
        })

      // validator
      if (!userGachaInfo.userId) {
        throw new BadRequestException(MsgHelper.MsgList.not_enough_reset)
      }

      let times = userGachaInfo.commonTimes - commonReset
      if (typeGet === 'special') {
        times = userGachaInfo.specialTimes - specialReset
      }
      if (times < 0) {
        throw new BadRequestException(MsgHelper.MsgList.not_enough_reset)
      }

      // update user gacha info
      if (typeGet === 'common') {
        userGachaInfo.commonTimes = times
      } else {
        userGachaInfo.specialTimes = times
      }
      await queryRunner.manager.getRepository(UserGachaInfo).save(userGachaInfo)

      // mint new ntf bed
      const gift = []

      const tx_gacha = uuidv4()
      const qualityNFT =
        typeGet === 'common' ? BED_QUALITY.Common : BED_QUALITY.Uncommon

      // save entity to ntfs table
      let nftEntity: any = await this.transferGenesisBedIfExist(queryRunner.manager, walletInfo.wallet, qualityNFT)
      if (!nftEntity) {
        const nft = new Nfts()
        nft.categoryId = CATEGORY_TYPE.BED
        nft.isLock = 0
        nft.status = 'DEFAULT'
        await queryRunner.manager.getRepository(Nfts).save(nft)

        // save entity to ntf attributes
        const type = NFT_TYPE_ATTRIBUTES.BEDS
        const contract = process.env.BED_CONTRACT
        const tokenId = await this.nftAttService.getTokenIdByCategory(
          nft.categoryId,
          queryRunner.manager
        )

        nftEntity = await genNftAttributeJson(
          CATEGORY_TYPE.BED,
          nft.id,
          type,
          walletInfo.wallet,
          contract,
          tokenId,
          0,
          qualityNFT
        )
        nftEntity.quality = qualityNFT
        nftEntity.classNft = await getRandomWithPercent(
          COMMON_BED_NORMAL_MAIN_NET
        )

        // update ntf attributes
        await queryRunner.manager.getRepository(NftAttributes).save(nftEntity)
        nftEntity.image = `${PATH_IMG[nftEntity.nftType]}${nftEntity.image}`

        //insert nft level up after having new bed
        const newNftLevelUp = new NftLevelUp()
        newNftLevelUp.bedId = nft.id
        newNftLevelUp.levelUpTime = await (
          await getLevel(nftEntity.level)
        ).level_time
        newNftLevelUp.status = NFT_LEVEL_UP_STATUS.PENDING
        await queryRunner.manager.getRepository(NftLevelUp).save(newNftLevelUp)
      }
      gift.push(nftEntity)

      // save entity to table gacha result
      const userGachaResult = UserGachaResult.create()
      userGachaResult.userId = userId
      userGachaResult.transactionId = tx_gacha
      userGachaResult.result = JSON.stringify(nftEntity)
      userGachaResult.gachaType = GACHA_TYPE[typeGet === 'common' ? 5 : 6]
      await queryRunner.manager
        .getRepository(UserGachaResult)
        .save(userGachaResult)

      await queryRunner.commitTransaction()
      return {
        status: "success",
        gift: gift.map((x) => {
          x.efficiency = parseFloat(x.efficiency?.toString())
          x.luck = parseFloat(x.luck?.toString())
          x.bonus = parseFloat(x.bonus?.toString())
          x.special = parseFloat(x.special?.toString())
          x.resilience = parseFloat(x.resilience?.toString())
          x.durability = parseFloat(x.durability?.toString())
          return x
        })
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async transferGenesisBedIfExist(manager: EntityManager, wallet: string, nftType: string): Promise<NftAttributes | null> {
    const genesisBed = await this.nftAttService.getGenesisBedAdmin(nftType)
    if (!genesisBed) return null;
    await manager.getRepository(NftAttributes)
      .update(
        {
          nftId: genesisBed.id
        },
        {
          owner: wallet,
          updatedAt: new Date()
        }
      )
    return genesisBed.attribute
  }

  private async getAnimation(listDataResult: any, gachaConfigs: any) {
    let result = 'Normal'
    let pList = gachaConfigs.find(
      (x) => x.key === GACHA_CONFIG_KEY.NORMAL_ANIMATION
    )?.value
    const hasOneGold = listDataResult.find(
      (x) => x.frame_colour === GACHA_ANIMATION.Gold
    )
    const hasOneRainBow = listDataResult.find(
      (x) => x.frame_colour === GACHA_ANIMATION.Rainbow
    )
    if (hasOneGold) {
      pList = gachaConfigs.find(
        (x) => x.key === GACHA_CONFIG_KEY.GOLD_ANIMATION
      )?.value
    }
    if (hasOneRainBow) {
      pList = gachaConfigs.find(
        (x) => x.key === GACHA_CONFIG_KEY.RAINBOW_ANIMATION
      )?.value
    }
    pList = pList ? JSON.parse(pList) : []
    if (!pList || !pList.length) return GACHA_ANIMATION_ENUM[result]
    const animationRd = await getRandomWithPercent(pList)
    result = animationRd ? animationRd : result
    return GACHA_ANIMATION_ENUM[result]
  }
}
