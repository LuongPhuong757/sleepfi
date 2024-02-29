import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { IMG_BED_BOX, PATH_IMG } from 'crawler/constants/attributes'
import { genNftAttributeJson } from 'crawler/MintNft'
import { CATEGORY_ID } from 'src/category/constants'
import {
  getLuckyBoxLevel,
  getRandomImage,
  getRandomWithPercent
} from 'src/common/LuckyBox'
import {
  LUCKY_BOX_GIFT_LEVEL_1,
  LUCKY_BOX_GIFT_LEVEL_2,
  OPEN_REDRAW_GIFT
} from 'src/common/OpenLuckyBox'
import { LuckyBox } from 'src/databases/entities/lucky_box.entity'
import { NftAttributes } from 'src/databases/entities/nft_attributes.entity'
import { Nfts } from 'src/databases/entities/nfts.entity'
import { NftAttributesRepository } from 'src/nft-attributes/nft-attributes.repository'
import { CATEGORY_TYPE, IS_BURN, NFT_TYPE } from 'src/nfts/constants'
import { PROFIT_TYPE } from 'src/profit/constants'
import { ProfitSevice } from 'src/profit/profit.service'
import { SpendingBalancesSevice } from 'src/spending_balances/spending_balances.service'
import { TOKEN_SYMBOL } from 'src/stack_details/enum'
import { ACTION_TARGET_TYPE, ACTION_TYPE } from 'src/tx-history/constant'
import { TxHistorySevice } from 'src/tx-history/tx-history.service'
import { Connection, Repository } from 'typeorm'

import { User } from '../databases/entities/user.entity'
import {
  IS_OPEN,
  LARGE_NUMBER_BOX,
  TOKEN_GIF,
  TYPE_GIFT
} from './constants/enum'
import { SpeedUpInput } from './dtos/speed-up.dto'

@Injectable()
export class LuckyBoxSevice {
  constructor(
    @InjectRepository(LuckyBox)
    private luckyBoxRepository: Repository<LuckyBox>,
    private spendingBalancesService: SpendingBalancesSevice,
    private txHistoryService: TxHistorySevice,
    private nftAttributesRepository: NftAttributesRepository,
    private readonly connection: Connection,
    private readonly profitSevice: ProfitSevice,
  ) { }

  async speedUp(input: SpeedUpInput, user: User) {
    const { luckyBoxId } = input
    const luckyBox = await this.luckyBoxRepository.findOne({ id: luckyBoxId })
    const now = new Date()
    const timeUp = (
      (Number(luckyBox.waitingTime) - now.getTime()) /
      (1000 * 60)
    ).toFixed()
    if (!luckyBox) throw new BadRequestException('LuckyBox not found')
    const totalOfToken = new BigNumber(timeUp)
      .times(luckyBox.speedUpCost)
      .toString()
    await this.spendingBalancesService.minusTokenSpendingBalances(user.id, TOKEN_SYMBOL, totalOfToken)

    // plus cost for profit
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      await this.profitSevice.processProfit(user.id, TOKEN_SYMBOL.toLowerCase(), totalOfToken.toString(), PROFIT_TYPE.SPEED_UP, queryRunner.manager)
      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new BadRequestException('Error ' + error)
    } finally {
      queryRunner.release()
    }

    luckyBox.waitingTime = now.getTime().toString()
    return await luckyBox.save()
  }

  async insertLuckyBox(
    level: number,
    speedUpCost: string,
    redrawRate: string,
    openingCost: string,
    waitingTime: number,
    userId: number
  ) {
    const checkTotalLuckyBox = await this.luckyBoxRepository.find({ userId })
    if (checkTotalLuckyBox.length >= LARGE_NUMBER_BOX)
      throw new BadRequestException('Exceeding the amount')
    const luckyBox = new LuckyBox()
    luckyBox.userId = 0
    luckyBox.level = level
    luckyBox.waitingTime = waitingTime.toString()
    luckyBox.speedUpCost = speedUpCost
    luckyBox.redrawRate = redrawRate
    luckyBox.openingCost = openingCost
    luckyBox.typeGift = ''
    luckyBox.image = getRandomImage(luckyBox.level)
    return luckyBox.save()
  }

  async openLuckyBox(luckyBoxId: number, user: User) {
    const luckyBox = await LuckyBox.findOne({ id: luckyBoxId, userId: user.id })
    if (!luckyBox) {
      throw new BadRequestException('Lucky Box not found')
    }
    if (luckyBox.isOpen == IS_OPEN.TRUE)
      throw new BadRequestException('Lucky box has been opened')
    const now = new BigNumber(new Date().getTime())
    const remainTime = new BigNumber(luckyBox.waitingTime)
    if (now.comparedTo(remainTime) == -1)
      throw new BadRequestException('Not enough time ')
    const gift =
      luckyBox.level == 1
        ? await getRandomWithPercent(LUCKY_BOX_GIFT_LEVEL_1)
        : await getRandomWithPercent(LUCKY_BOX_GIFT_LEVEL_2)
    const balance = await this.spendingBalancesService.minusTokenSpendingBalances(
      user.id,
      TOKEN_SYMBOL,
      luckyBox.openingCost
    )

    // plus cost for profit
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      await this.profitSevice.processProfit(user.id, TOKEN_SYMBOL.toLowerCase(), luckyBox.openingCost.toString(), PROFIT_TYPE.OPEN_LUCKY_BOX, queryRunner.manager)
      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new BadRequestException('Error ' + error)
    } finally {
      queryRunner.release()
    }

    const openGift = await this.openGift(
      gift,
      luckyBox.level,
      user.id,
      luckyBox,
      gift
    )
    await this.txHistoryService.addHistory({
      type: ACTION_TYPE.OPEN_LUCK_BOX,
      targetType: ACTION_TARGET_TYPE.LUCKY_BOX,
      userId: user.id,
      symbol: TOKEN_SYMBOL,
      amount: luckyBox.openingCost,
      nftId: null,
      tokenId: null,
      tokenAddress: process.env.SLFT_ADDRESS,
      beforeBalance: balance.beforeBalance,
      currentBalance: balance.newBalance
    })

    return openGift
  }

  async openGift(
    value: string,
    levelLuckyBox: number,
    userId: number,
    luckyBox: LuckyBox,
    giftRandom: any
  ) {
    const user = await User.findOne({ id: userId })
    const userWallet = user.wallet
    const gift = value.split('-')
    const giftName = gift[0]
    switch (giftName) {
      case TYPE_GIFT.JEWEL:
        return await this.insertNftGift(
          TYPE_GIFT.JEWEL,
          levelLuckyBox,
          userWallet,
          luckyBox,
          giftRandom
        )
      case TYPE_GIFT.TOKEN:
        return await this.updateTokenGift(gift[1], gift[2], userId, luckyBox)
      case TYPE_GIFT.BEDBOX:
        return await this.insertNftGift(
          TYPE_GIFT.BEDBOX,
          levelLuckyBox,
          userWallet,
          luckyBox,
          giftRandom
        )
      case TYPE_GIFT.REDRAW:
        return await this.insertLuckyBoxWithRedraw(
          levelLuckyBox,
          userId,
          luckyBox
        )
      default:
        return
    }
  }

  shuffle(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, num)
  }

  async insertLuckyBoxWithRedraw(
    levelLuckyBox: number,
    userId: number,
    luckyBox: LuckyBox
  ) {
    const user = await User.findOne({ id: userId })
    const userWallet = user.wallet
    const indexes = this.shuffle([...Array(OPEN_REDRAW_GIFT.length).keys()], 5)
    let nftRedraw
    let tokenRedraw
    const nfts = []
    const tokens = []
    for (let i = 0; i < indexes.length; i++) {
      const gift = OPEN_REDRAW_GIFT[indexes[i]].value.split('-')
      if (gift[0] == 'jewel') {
        nftRedraw = await this.insertNftAttribute(
          TYPE_GIFT.JEWEL,
          userWallet,
          levelLuckyBox,
          OPEN_REDRAW_GIFT[indexes[i]]
        )
        nftRedraw['nftAttributes']['image'] = `${PATH_IMG[nftRedraw.nftAttributes.nftType]
          }${nftRedraw.nftAttributes.image}`
        nfts.push(nftRedraw)
      }
      if (gift[0] == 'bedbox') {
        nftRedraw = await this.insertNftAttribute(
          TYPE_GIFT.BEDBOX,
          userWallet,
          levelLuckyBox,
          OPEN_REDRAW_GIFT[indexes[i]]
        )
        nftRedraw['nftAttributes']['image'] = `${PATH_IMG[nftRedraw.nftAttributes.nftType]
          }${nftRedraw.nftAttributes.image}`
        nfts.push(nftRedraw)
      }
      if (gift[0] == 'token') {
        tokenRedraw = await this.updateTokenGift(
          gift[1],
          gift[2],
          userId,
          luckyBox
        )
        tokens.push(tokenRedraw.gift)
      }
    }

    luckyBox.isOpen = IS_OPEN.TRUE
    luckyBox.typeGift = TYPE_GIFT.REDRAW
    await luckyBox.save()
    return {
      status: 'success',
      nft: null,
      nfts,
      tokens
    }
  }

  async insertNftGift(
    name: string,
    levelLuckyBox: number,
    owner: string,
    luckyBox: LuckyBox,
    giftRandom: any
  ) {
    const dataGift = await this.getDataGift(name)
    const nft = await this.insertNftAttribute(
      name,
      owner,
      levelLuckyBox,
      giftRandom
    )
    nft['nftAttributes']['image'] = `${PATH_IMG[nft.nftAttributes.nftType]}${nft.nftAttributes.image
      }`
    luckyBox.nftId = nft.id
    luckyBox.isOpen = IS_OPEN.TRUE
    luckyBox.typeGift = dataGift.typeGift
    await luckyBox.save()
    return {
      status: 'success',
      nft,
      nfts: null
    }
  }

  async updateTokenGift(
    symbol: string,
    level: string,
    userId: number,
    luckyBox: LuckyBox
  ) {
    let amount = '0'
    switch (level) {
      case '2':
        amount = (Math.random() * 5 + 5).toFixed(1).toString()
        break

      case '3':
        amount = (Math.random() * 10 + 20).toFixed(1).toString()
        break
      default:
        amount = (Math.random() * 5).toFixed(1).toString()
    }

    luckyBox.symbol = symbol
    luckyBox.amount = amount
    luckyBox.typeGift = TYPE_GIFT.TOKEN
    luckyBox.isOpen = IS_OPEN.TRUE
    await luckyBox.save()

    await this.spendingBalancesService.plusAmoutSpending(amount, symbol, userId)
    return {
      status: 'success',
      gift: {
        type: `${TOKEN_GIF}`,
        amount: `${Number(amount)}`
      }
    }
  }

  async getDataGift(name: string) {
    let dataGift = {
      category: CATEGORY_TYPE.JEWEL,
      type: NFT_TYPE.JEWEL,
      typeGift: TYPE_GIFT.JEWEL
    }
    if (name == TYPE_GIFT.BEDBOX) {
      dataGift = {
        category: CATEGORY_TYPE.BED,
        type: NFT_TYPE.BED_BOX,
        typeGift: TYPE_GIFT.BEDBOX
      }
    }
    return dataGift
  }

  async insertNftAttribute(
    name: string,
    owner: string,
    levelLuckyBox: number,
    giftRandom: any
  ) {
    const dataGift = await this.getDataGift(name)
    const { category, type, typeGift } = dataGift
    const getMaxBedboxTokenId = await this.nftAttributesRepository.find({
      where: {
        nftType: NFT_TYPE.BED_BOX
      },
      order: {
        tokenId: 'DESC'
      }
    })
    const tokenBedbox = getMaxBedboxTokenId[0]?.tokenId + 1 || 1

    const getMaxJewelTokenId = await this.nftAttributesRepository.find({
      where: {
        nftType: NFT_TYPE.JEWEL
      },
      order: {
        tokenId: 'DESC'
      }
    })
    const tokenJewel = getMaxJewelTokenId[0]?.tokenId + 1 || 1
    let giftName
    if (typeof giftRandom === 'object') {
      giftName = giftRandom.value.split('-')
    } else {
      giftName = giftRandom.split('-')
    }
    let nftSave
    let bedboxSave
    let jewelSave
    await this.connection.transaction(async (entityManager) => {
      const nft = new Nfts()
      nft.categoryId = category
      nft.isLock = 0
      nft.status = 'DEFAULT'
      nftSave = await nft.save()
      switch (+category) {
        case 1:
          const handleBedbox = await genNftAttributeJson(
            CATEGORY_ID.Bedbox,
            nftSave.id,
            type,
            owner,
            process.env.BED_BOX_CONTRACT,
            tokenBedbox
          )
          const newBedbox = new NftAttributes()
          newBedbox.nftId = nftSave.id
          newBedbox.nftName = handleBedbox.nftName
          newBedbox.name = handleBedbox.name
          newBedbox.parent1 = null
          newBedbox.parent2 = null
          newBedbox.image = `/${IMG_BED_BOX[giftName[1]]}.png`
          newBedbox.contractAddress = process.env.BED_BOX_CONTRACT
          newBedbox.type = 'bedbox'
          newBedbox.nftType = 'bedbox'
          newBedbox.classNft = ''
          newBedbox.quality = giftName[1]
          newBedbox.effect = ''
          newBedbox.isMint = 0
          newBedbox.isBurn = IS_BURN.FALSE
          newBedbox.owner = owner
          newBedbox.time = 0
          newBedbox.level = 0
          newBedbox.bedMint = 0
          newBedbox.efficiency = 0
          newBedbox.luck = 0
          newBedbox.bonus = 0
          newBedbox.special = 0
          newBedbox.resilience = 0
          newBedbox.tokenId = tokenBedbox
          newBedbox.durability = 100
          newBedbox.percentEffect = null
          bedboxSave = await entityManager.save(newBedbox)
          break
        case 2:
          const handleJewel = await genNftAttributeJson(
            CATEGORY_ID.Jewel,
            nftSave.id,
            giftName[1],
            owner,
            process.env.JEWEL_CONTRACT,
            tokenJewel,
            1
          )
          const newJewel = new NftAttributes()
          newJewel.nftId = nftSave.id
          newJewel.nftName = handleJewel.nftName
          newJewel.name = handleJewel.name
          newJewel.parent1 = null
          newJewel.parent2 = null
          newJewel.image = handleJewel.image
          newJewel.contractAddress = process.env.JEWEL_CONTRACT
          newJewel.type = handleJewel.type
          newJewel.nftType = 'jewel'
          newJewel.jewelType = giftName[1]
          newJewel.effect = handleJewel.effect
          newJewel.classNft = ''
          newJewel.quality = ''
          newJewel.isMint = 0
          newJewel.isBurn = IS_BURN.FALSE
          newJewel.owner = owner
          newJewel.time = 0
          newJewel.level = Number(giftName[2])
          newJewel.bedMint = 0
          newJewel.efficiency = 0
          newJewel.luck = 0
          newJewel.bonus = 0
          newJewel.special = 0
          newJewel.resilience = 0
          newJewel.tokenId = tokenJewel
          newJewel.durability = 100
          newJewel.jewelCorrection = handleJewel.correction
          newJewel.percentEffect = handleJewel.correction
          jewelSave = await entityManager.save(newJewel)
          break
      }
    })
    nftSave['nftAttributes'] = bedboxSave ? bedboxSave : jewelSave
    return nftSave
  }

  async getLuckFomula(luck: number, owner: string) {
    const totalBed = await NftAttributes.count({
      owner,
      nftType: NFT_TYPE.BEDS
    })
    return (totalBed / 3) * Math.pow(luck, 0.3)
  }

  async createLuckyBox(
    speedUpCost: string,
    redrawRate: string,
    openingCost: string,
    waitingTime: number,
    userId: number,
    luckFomula: number
  ) {
    const luckyBoxLevel = await getLuckyBoxLevel(luckFomula)
    if (luckyBoxLevel == 'nothing') return
    const luckyBox = await this.insertLuckyBox(
      luckyBoxLevel.split('')[2],
      speedUpCost,
      redrawRate,
      openingCost,
      waitingTime,
      userId
    )
    return luckyBox
  }

  async getLuckyBox(luckFomula) {
    const luckyBoxLevel = await getLuckyBoxLevel(luckFomula)
    if (luckyBoxLevel && luckyBoxLevel == 'nothing') return
    return luckyBoxLevel.split('')[2]
  }

  async getLuckyBoxOfUser(user: User) {
    const luckyBoxs = await LuckyBox.find({
      userId: user.id,
      isOpen: IS_OPEN.FALSE
    })
    return luckyBoxs.map((x) => {
      const pathName = String(x.id).padStart(5, '0')
      x['name'] = `${pathName}`
      const imagesSplited = x.image.split('/')
      x['lucky_box_type'] = imagesSplited.pop().replace(/[^0-9]/g, '')
      return x
    })
  }
}
