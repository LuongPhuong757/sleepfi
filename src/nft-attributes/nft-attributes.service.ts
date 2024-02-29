import { BadRequestException, Injectable } from '@nestjs/common'
import BigNumber from 'bignumber.js'
import { isNumber } from 'class-validator'
import { PATH_IMG } from 'crawler/constants/attributes'
import { genNftAttributeJson } from 'crawler/MintNft'
import _ from 'lodash'
import { BedInformationRepository } from 'src/bed-information/repositories/bed-information.repository'
import { CategoryRepository } from 'src/category/category.repository'
import { getRandomWithPercent, PERCENT_CLASS, PERCENT_QUALITY } from 'src/common/LuckyBox'
import { MESSAGE } from 'src/common/messageError'
import { BED_CLASS_FROM_LUCKY_BOX } from 'src/common/OpenLuckyBox'
import { getLevel } from 'src/common/Utils'
import { BedHistory } from 'src/databases/entities/bed_history.entity'
import { BedInformation } from 'src/databases/entities/bed_information.entity'
import { BedMintings } from 'src/databases/entities/bed_minting.entity'
import { Category } from 'src/databases/entities/categories.entity'
import { NftLevelUp } from 'src/databases/entities/nft_level_up.entity'
import { Nfts } from 'src/databases/entities/nfts.entity'
import { SpendingBalances } from 'src/databases/entities/spending_balances.entity'
import { SALE_NFT_STATUS } from 'src/market-place/constant'
import { NftRepository } from 'src/nfts/nfts.repository'
import { PROFIT_TYPE } from 'src/profit/constants'
import { ProfitSevice } from 'src/profit/profit.service'
import { SpendingBalancesRepository } from 'src/spending_balances/spending_balances.repository'
import { TOKEN_SYMBOL } from 'src/stack_details/enum'
import { STATUS_TRACKING } from 'src/tracking/constants'
import { ACTION_TYPE } from 'src/tx-history/constant'
import { TxHistorySevice } from 'src/tx-history/tx-history.service'
import { Connection, EntityManager, IsNull, Not } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { NftAttributes } from '../databases/entities/nft_attributes.entity'
import { User } from '../databases/entities/user.entity'
import { INSURANCE_COST_PERCENT, IS_BURN, NFT_LEVEL_UP_STATUS, NFT_TYPE } from '../nfts/constants'
import { BED_TYPE_TIME } from '../tracking/constants'
import { TrackingRepository } from "../tracking/repositories/tracking.repository";
import { TrackingService } from '../tracking/tracking.service'
import { CATEGORY_ID, FREE, IS_LOCK, SOCKET } from './constants'
import { BedDetailDto } from './dtos/bed-detail.dto'
import { ListItemOwnerDto } from './dtos/list-item-by-owner.dto'
import { ListJewelOwnerDto } from './dtos/list-jewel-by-owner.dto'
import { ListItemJewelByTypeLevelDto } from './dtos/list-jewel-item-by-level-type.dto'
import { ListNftsByOwnerDto } from './dtos/list-nft-by-owner.dto'
import { ListNftsInHomePageDto } from './dtos/list-nft-in-home-page.dto'
import { NftAttributesRepository } from './nft-attributes.repository'

@Injectable()
export class NftAttributesSevice {
  constructor(
    private readonly nftAttributesRepository: NftAttributesRepository,
    private readonly spendingBalancesRepository: SpendingBalancesRepository,
    private readonly bedInformationRepository: BedInformationRepository,
    private readonly nftRepository: NftRepository,
    private readonly connection: Connection,
    private readonly trackingService: TrackingService,
    private readonly categoryRepository: CategoryRepository,
    private readonly txHistoryService: TxHistorySevice,
    private readonly trackingRepository: TrackingRepository,
    private profitService: ProfitSevice,
  ) { }

  async getDetailNft(nftId: number) {
    const detail = await this.nftAttributesRepository.findOne({ nftId })
    return detail
  }

  getGenesisBedAdmin(nftType: string): Promise<Nfts> {
    return this.nftRepository
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.attribute', 'na')
      .where('n.isLock = :isLock AND na.owner = :adminAddress AND na.quality = :quality',
        {
          isLock: 0,
          adminAddress: process.env.OWNER_NFT_WALLET,
          quality: nftType,
        }
      )
      .andWhere('n.id <= :maxGenesisBedId',
        {
          maxGenesisBedId: 10000
        }
      )
      .getOne()
  }

  async updateOwnerNft(
    buyerAddress: string,
    sellerAddress: string,
    nftId: number,
    manager: EntityManager
  ) {
    // const nft = await this.nftAttributesRepository.findOne({ nftId })
    // if (buyerAddress.toLowerCase() === nft.owner.toLowerCase())
    //   throw new Error(MESSAGE.do_not_buy_your_nft)
    // if (sellerAddress.toLowerCase() !== nft.owner.toLowerCase())
    //   throw new Error(MESSAGE.not_owner_nft)
    // await manager.update(NftAttributes, nft.id, {
    //   owner: buyerAddress,
    //   updatedAt: new Date()
    // })

    const nft = await manager
      .getRepository(NftAttributes)
      .createQueryBuilder('na')
      .where('na.nft_id = :nftId', {nftId})
      .getOne();
    if (buyerAddress.toLowerCase() === nft.owner.toLowerCase())
      throw new Error(MESSAGE.do_not_buy_your_nft)
    if (sellerAddress.toLowerCase() !== nft.owner.toLowerCase())
      throw new Error(MESSAGE.not_owner_nft)
    await manager.update(NftAttributes, nft.id, {
      owner: buyerAddress,
      updatedAt: new Date()
    })
  }

  async getNftByOwner(owner: string, data: ListNftsByOwnerDto) {
    const { limit, page, categoryId, type } = data
    const listNft = await this.nftAttributesRepository
      .createQueryBuilder('nftAttributes')
      .innerJoinAndSelect(
        'nftAttributes.nft',
        'nfts',
        'nftAttributes.nftId = nfts.id'
      )
      .leftJoinAndSelect('nfts.sales', 'saleNft')
      .where(`nftAttributes.owner = '${owner}'`)
      .andWhere('nftAttributes.is_burn = :isBurn', { isBurn: IS_BURN.FALSE })
      .orderBy('nftAttributes.updated_at', 'DESC')
      .limit(limit)
      .offset(limit * (page - 1))

    if (+categoryId) {
      listNft.andWhere(`nfts.category_id = ${categoryId}`)
      switch (+categoryId) {
        case 1:
          if (type) {
            listNft.andWhere('nftAttributes.nft_type In (:type)', { type })
          } else {
            listNft.andWhere('nftAttributes.nft_type In (:type)', {
              type: NFT_TYPE.BEDS
            })
          }
          break
        default:
          break
      }
    }
    const [_list, count] = await Promise.all([
      listNft.getMany(),
      listNft.getCount()
    ])

    const list = await Promise.all(
      _list.map(async (x) => {
        const waitingTime = await this.getWaitingTime(x.nftId)

        const checkLevelMint = await this.checkLevelMint(x.nftId)
        x.efficiency = parseFloat(x.efficiency.toString())
        x.luck = parseFloat(x.luck.toString())
        x.bonus = parseFloat(x.bonus.toString())
        x.special = parseFloat(x.special.toString())
        x.resilience = parseFloat(x.resilience.toString())
        x['waitingTime'] = waitingTime
        x['isLevelMint'] = checkLevelMint
        x.durability = parseFloat(x.durability.toString())
        let objData = {}
        const nftSale = x.nft.sales ? x.nft.sales : null
        delete x.nft.sales
        if (x.nftType === NFT_TYPE.BEDS) {
          objData = {
            insurancePercent: INSURANCE_COST_PERCENT[_.lowerCase(x.quality)],
            startTime: BED_TYPE_TIME[x.classNft.toUpperCase()]?.Min,
            endTime: BED_TYPE_TIME[x.classNft.toUpperCase()]?.Max
          }
        }
        if (x.nftType === NFT_TYPE.BED_BOX) {
          const imagesSplited = x.image.split('/')
          x['bed_box_type'] = imagesSplited.pop().replace(/[^0-9]/g, '')
        }
        const data = { ...x, nftSale, ...objData }
        return data
      })
    )
    return { list, count }
  }
  // )

  async getWaitingTime(bedId: number) {
    const bedMinting = await BedMintings.findOne({ bedId: bedId })
    let waitingTime = '0'
    if (bedMinting) {
      waitingTime = bedMinting.waitingTime
    }
    return waitingTime
  }

  async checkLevelMint(bedId: number) {
    const bedMinting = await BedMintings.findOne({ bedId: bedId })
    if (!bedMinting) {
      return false
    }
    return Number(bedMinting.mintedNumber) < Number(bedMinting.maxMinting)
  }

  async getJewelOrItemByLevelAndType(
    wallet: string,
    payload: ListItemJewelByTypeLevelDto
  ) {
    // get category id
    const { categoryId } = payload

    // get jewel or item user
    const query = await this.nftAttributesRepository
      .createQueryBuilder('na')
      .leftJoinAndSelect('na.nft', 'nfts', 'na.nftId = nfts.id')
      .leftJoinAndSelect('nfts.sales', 'saleNft')
      .where('na.owner = :owner', { owner: wallet })
      .andWhere('na.is_burn = :isBurn', { isBurn: IS_BURN.FALSE })
      .andWhere(`nfts.category_id = :categoryId`, { categoryId: categoryId })
      .andWhere('nfts.is_lock = :status', { status: 0 })
      .orderBy('nfts.id', 'ASC')
      .getMany()

    //format response
    const data = query.filter((item) => {
      const nfts = item.nft ? item.nft : null
      const nftSale = item.nft.sales ? item.nft.sales : null

      delete nfts.sales
      delete item.nft

      if (
        !nftSale ||
        (nftSale && nftSale.status == SALE_NFT_STATUS.NOT_ON_SALE)
      ) {
        return { ...item, nfts, nftSale }
      }
    })

    return { data }
  }

  async getItemByOwner(owner: string, listItemOwnerDto: ListItemOwnerDto) {
    try {
      const { limit, page, type, minLevel, maxLevel } = listItemOwnerDto
      const query = this.nftAttributesRepository
        .createQueryBuilder('na')
        .leftJoinAndSelect('na.nft', 'nfts', 'na.nftId = nfts.id')
        .leftJoinAndSelect('nfts.sales', 'saleNft')
        .where('na.owner = :owner', { owner })
        .andWhere(`nfts.category_id = :category_id`, {
          category_id: CATEGORY_ID.ITEM
        })
        .andWhere('nfts.is_lock = :isLock AND na.is_burn = :isBurn', {
          isLock: IS_LOCK.NOT_LOCK,
          isBurn: IS_BURN.FALSE
        })
        .limit(limit)
        .offset(limit * (page - 1))

      if (type.length) {
        query.andWhere('na.item_type In (:type)', { type })
      }
      if (minLevel >= 0 && maxLevel >= 0) {
        query.andWhere('na.level between :minLevel and :maxLevel', {
          minLevel,
          maxLevel
        })
      }
      const [_list, count] = await Promise.all([
        query.getMany(),
        query.getCount()
      ])

      const list = _list.map((x) => {
        x.efficiency = parseFloat(x.efficiency.toString())
        x.luck = parseFloat(x.luck.toString())
        x.bonus = parseFloat(x.bonus.toString())
        x.special = parseFloat(x.special.toString())
        x.resilience = parseFloat(x.resilience.toString())
        x.durability = parseFloat(x.durability.toString())
        return x
      })
      return { list, count }
    } catch (error) {
      console.log('---------error---------:', error)
    }
  }
  async bedDetail(bedDetailDto: BedDetailDto, owner: string) {
    try {
      const query = await this.nftAttributesRepository
        .createQueryBuilder('na')
        .leftJoinAndSelect('na.nft', 'nfts', 'na.nftId = nfts.id')
        .leftJoinAndSelect('nfts.sales', 'saleNft')
        .where(`na.nftId = ${bedDetailDto.bedId}`)

      const jewels = await this.bedInformationRepository
        .createQueryBuilder('bed_infor')
        .select([
          'bed_infor.socket as socket',
          'bed_infor.jewel_slot_1 as jewelSlot1',
          'bed_infor.jewel_slot_2 as jewelSlot2',
          'bed_infor.jewel_slot_3 as jewelSlot3',
          'bed_infor.jewel_slot_4 as jewelSlot4',
          'bed_infor.jewel_slot_5 as jewelSlot5',
          'bed_infor.socket_slot_1 as socketSlot1',
          'bed_infor.socket_slot_2 as socketSlot2',
          'bed_infor.socket_slot_3 as socketSlot3',
          'bed_infor.socket_slot_4 as socketSlot4',
          'bed_infor.socket_slot_5 as socketSlot5',
          'bed_infor.item_id as itemId',
          '(select na.image from `nft_attributes` na where na.nft_id = bed_infor.item_id) as itemImage'
        ])
        .leftJoin('nft_attributes', 'na', 'na.nft_id = bed_infor.bed_id')
        .where(`na.nft_id = bed_infor.bed_id`)
        .andWhere('bed_id = :bedId', { bedId: bedDetailDto.bedId })
        .getRawOne()

      const jewelIds = [
        jewels?.jewelSlot1,
        jewels?.jewelSlot2,
        jewels?.jewelSlot3,
        jewels?.jewelSlot4,
        jewels?.jewelSlot5
      ]
      // for (const key in jewels) {
      //   if (key) {
      //     jewelIds.push(jewels[key])
      //   }
      // }

      // if (jewelIds.length) {
      const listJewelQuery = this.nftAttributesRepository
        .createQueryBuilder('na')
        .where(`nft_id IN (:...jewelIds)`, { jewelIds: jewelIds })
        .andWhere('nft_type = :nftType', { nftType: NFT_TYPE.JEWEL })
      // }
      const result = await query.getOne()
      const [listJewel, bedHistory, nftLevelUp] = await Promise.all([
        listJewelQuery ? listJewelQuery.getMany() : [],
        BedHistory.findOne({ bedId: bedDetailDto.bedId }),
        NftLevelUp.findOne({ bedId: bedDetailDto.bedId })
      ])

      const arrResult: any = []
      jewelIds.map((i) => {
        arrResult.push(listJewel.find((n) => n.nftId == i))
      })
      let objData = {}
      if (bedDetailDto.isBase == true) {
        objData = { ...result, ...bedHistory }
      } else {
        let item
        if (bedDetailDto.itemId) {
          item = await this.nftRepository.findOne(bedDetailDto.itemId, {
            relations: ['attribute']
          })
        }
        const totalStats = await this.trackingService.totalBedStats(
          result,
          listJewel,
          item
        )
        objData = { ...result, ...totalStats }
      }
      if (!result) {
        throw new Error(MESSAGE.nft_not_found)
      }

      objData['socket'] = jewels?.socket || 0
      objData['sockets'] = [
        { socket: jewels?.socketSlot1, jewel: arrResult[0] || null },
        { socket: jewels?.socketSlot2 || null, jewel: arrResult[1] || null },
        { socket: jewels?.socketSlot3 || null, jewel: arrResult[2] || null },
        { socket: jewels?.socketSlot4 || null, jewel: arrResult[3] || null },
        { socket: jewels?.socketSlot5 || null, jewel: arrResult[4] || null }
      ]
      objData['itemId'] = { id: jewels?.itemId, image: jewels?.itemImage }
      objData['remainTime'] = nftLevelUp?.remainTime || null
      const category = {
        category_id: result.nft.categoryId,
        category_name: result.type
      }
      const nftSale = result.nft.sales ? result.nft.sales : null
      delete result.nft.sales

      return {
        ...objData,
        nftSale,
        ...category,
        insurancePercent: INSURANCE_COST_PERCENT[_.lowerCase(result.quality)],
        startTime: BED_TYPE_TIME[result.classNft.toUpperCase()]?.Min || null,
        endTime: BED_TYPE_TIME[result.classNft.toUpperCase()]?.Max || null,
        waitingTime: await this.getWaitingTime(bedDetailDto.bedId),
        checkLevelMint: await this.checkLevelMint(bedDetailDto.bedId)
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getListJewelsByUser(
    owner: string,
    listNftsInHomePageDto: ListNftsInHomePageDto
  ) {
    const { page, limit } = listNftsInHomePageDto
    const listJewelByOwner = this.nftAttributesRepository
      .createQueryBuilder('na')
      .leftJoinAndSelect('na.nft', 'nfts', 'na.nftId = nfts.id')
      .leftJoinAndSelect('nfts.sales', 'saleNft')
      .where('na.owner = :owner', { owner })
      .andWhere('na.nft_type = :name', { name: NFT_TYPE.JEWEL })
      .andWhere('na.is_burn = :is_burn', { is_burn: IS_BURN.FALSE })
      .andWhere('nfts.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
      .limit(limit)
      .offset(limit * (page - 1))

    const [list, count] = await Promise.all([
      listJewelByOwner.getMany(),
      listJewelByOwner.getCount()
    ])
    return { list, count }
  }

  async addItemForBed(owner: string, bedId: number, itemId: number) {
    try {
      const checkItemOfOwner =
        await this.nftAttributesRepository.checkItemOfOwner(
          owner,
          bedId,
          itemId
        )
      if (checkItemOfOwner != 2)
        return { status: false, message: 'You do not own this nft' }
      const getBedByBedId = await this.bedInformationRepository.getBedByBedId(
        bedId
      )
      const checkItem = await this.nftRepository
        .createQueryBuilder('nft')
        .select(['nft.id'])
        .where('nft.id = :itemId', { itemId })
        .andWhere('nft.category_id = :category_id', {
          category_id: CATEGORY_ID.ITEM
        })
        .andWhere('nft.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
        .getCount()

      if (!checkItem) {
        throw new Error(MESSAGE.no_items_found_or_items_used_for_another_bed)
      }

      // Create Transaction
      const queryRunner = this.connection.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      try {
        if (!getBedByBedId) {
          const addItemForBed = new BedInformation()
          addItemForBed.hashId = uuidv4()
          addItemForBed.enable = true
          addItemForBed.bedId = bedId
          addItemForBed.itemId = itemId
          await queryRunner.manager.save(addItemForBed)
        }
        if (getBedByBedId && !getBedByBedId.item_id) {
          await queryRunner.manager
            .getRepository(BedInformation)
            .update({ bedId: bedId }, { itemId: itemId, enable: true })
        }
        if (getBedByBedId && getBedByBedId.item_id) {
          throw new Error(MESSAGE.the_bed_has_been_added_item)
        }

        await queryRunner.manager
          .getRepository(Nfts)
          .update({ id: itemId }, { isLock: IS_LOCK.USED })

        await queryRunner.commitTransaction()
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        queryRunner.release()
      }

      return { status: 200, message: 'The bed has been successfully added' }
    } catch (error) {
      throw new BadRequestException('Error ' + error)
    }
  }

  async removeItemFromBed(owner, bedId, itemId) {
    try {
      const checkItemOfOwner =
        await this.nftAttributesRepository.checkItemOfOwner(
          owner,
          bedId,
          itemId
        )

      if (checkItemOfOwner != 2) {
        throw new Error(MESSAGE.you_do_not_own_this_nft)
      }

      // Create Transaction
      const queryRunner = this.connection.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      try {
        const resultRemoveItem = await Promise.all([
          queryRunner.manager
            .getRepository(BedInformation)
            .update({ bedId: bedId }, { itemId: null, enable: false }),
          queryRunner.manager
            .getRepository(Nfts)
            .update({ id: itemId }, { isLock: IS_LOCK.NOT_LOCK })
        ])
        if (resultRemoveItem[0].affected == 1) {
          await queryRunner.commitTransaction()
          return { status: 200, message: 'Remove successfully!' }
        } else {
          throw new Error('You have no items to remove')
        }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        queryRunner.release()
      }
    } catch (error) {
      throw new BadRequestException('Error ' + error)
    }
  }

  async checkJewelByOwner(owner: string) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select(['na.id'])
      .leftJoin('nfts', 'n', 'n.id = na.nft_id')
      .where('na.owner = :owner', { owner })
      .andWhere('n.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
      .andWhere('n.category_id = :categoryId', {
        categoryId: CATEGORY_ID.JEWEL
      })
      .getRawMany()
  }

  async checkIsSleepBedByOwner(owner: string, bedId: number) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select(['na.id'])
      .leftJoin('tracking', 't', 't.bed_used = na.nft_id')
      .where('na.owner = :owner', { owner })
      .andWhere('na.nft_type = :nftType', { nftType: NFT_TYPE.BEDS })
      .andWhere('t.bed_used = :bed_used', { bed_used: bedId })
      .andWhere('t.status = :status', { status: STATUS_TRACKING.SLEEPING })
      .getRawOne()
  }

  async checkBalanceByOwner(owner: string) {
    return await this.spendingBalancesRepository.findOne({
      where: { wallet: owner, tokenAddress: process.env.SLFT_ADDRESS }
    })
  }

  async updateAmount(owner: string, fee: number, queryRunner: any) {
    try {
      const availableBalance = await this.checkBalanceByOwner(owner)
      const availableAmountBalances = new BigNumber(
        availableBalance.availableAmount
      )
      const amountBalances = new BigNumber(availableBalance.amount)
      return await queryRunner.manager.getRepository(SpendingBalances).update(
        {
          wallet: owner,
          tokenAddress: process.env.SLFT_ADDRESS
        },
        {
          availableAmount: new BigNumber(availableAmountBalances)
            .minus(fee)
            .toString(),
          amount: new BigNumber(amountBalances).minus(fee).toString()
        }
      )
    } catch (error) {
      console.log('-----------error----------:', error)
    }
  }

  async findBedByOwner(owner: string, bedId: number) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select(['na.id'])
      .where('na.owner = :owner', { owner })
      .andWhere('na.nft_id = :id', { id: bedId })
      .andWhere('na.nft_type = :nftType', { nftType: NFT_TYPE.BEDS })
      .getRawOne()
  }

  async openSocket(owner: string, bedId: number, index: number) {
    try {
      const bedByOwner = await this.findBedByOwner(owner, bedId)
      if (!bedByOwner) {
        throw new Error(MESSAGE.nft_not_found)
      }
      const isSleep = await this.checkIsSleepBedByOwner(owner, bedId)
      if (isSleep) {
        throw new Error(MESSAGE.sleeping_bed)
      }

      const findBed = await this.bedInformationRepository.find({
        where: {
          bedId,
          socket: Not(IsNull())
        }
      })
      const checkLevelBed = await this.nftAttributesRepository
        .createQueryBuilder('na')
        .select(['na'])
        .leftJoin('nfts', 'n', 'n.id = na.nft_id')
        .where('na.nft_id = :nftId', { nftId: bedId })
        .andWhere('n.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
        .getRawOne()

      const availableBalance = await this.checkBalanceByOwner(owner)
      const availableAmountBalances = new BigNumber(
        availableBalance.availableAmount
      )
      const amountBalances = new BigNumber(availableBalance.amount)
      if (
        availableAmountBalances.isLessThan(FREE) &&
        amountBalances.isLessThan(FREE)
      ) {
        throw new Error(MESSAGE.balance_not_enough + `_to_open_socket`)
      }

      // Create Transaction
      const queryRunner = this.connection.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      try {
        const bedInfor = new BedInformation()
        if (findBed.length == 0) {
          bedInfor.hashId = uuidv4()
          bedInfor.bedId = bedId
          bedInfor.socket = 0
          await bedInfor.save()
        }
        if (checkLevelBed.na_level < 5) {
          throw new Error(MESSAGE.not_enough_level_to_open_socket)
        }
        const checkSocket = await this.bedInformationRepository.findOne({
          where: {
            bedId
          }
        })
        if (checkSocket.socket == SOCKET.SOCKET_5) {
          throw new Error('Unable to open socket!')
        }
        if (checkSocket) {
          const newSocket = checkSocket.socket + 1
          const baseFactor =
            newSocket >= SOCKET.SOCKET_2 && newSocket < SOCKET.SOCKET_5 ? 5 : 0
          if (checkLevelBed.na_level >= baseFactor + 5 * newSocket) {
            const findBedInfor = await this.bedInformationRepository
              .createQueryBuilder('bi')
              .select([
                'bi.bed_id',
                'bi.socket_slot_1 as socket_slot_1',
                'bi.socket_slot_2 as socket_slot_2',
                'bi.socket_slot_3 as socket_slot_3',
                'bi.socket_slot_4 as socket_slot_4',
                'bi.socket_slot_5 as socket_slot_5'
              ])
              .leftJoin('nft_attributes', 'na', 'na.nft_id = bi.bed_id')
              .where('na.owner = :owner', { owner })
              .andWhere('bi.bed_id = :bed_id', { bed_id: bedId })
              .getRawOne()

            const arrSocket = [
              findBedInfor.socket_slot_1,
              findBedInfor.socket_slot_2,
              findBedInfor.socket_slot_3,
              findBedInfor.socket_slot_4,
              findBedInfor.socket_slot_5
            ]

            if (arrSocket[index] != null)
              throw new BadRequestException(MESSAGE.no_socket_to_open)
            this.updateAmount(owner, FREE, queryRunner)

            // plus amount for profit
            const user = await User.findOne({ wallet: owner })
            await this.profitService.processProfit(user.id, TOKEN_SYMBOL.toLowerCase(), FREE.toString(), PROFIT_TYPE.OPEN_SOCKET, queryRunner.manager)

            await queryRunner.manager.getRepository(BedInformation).update(
              { bedId: bedId },
              {
                socket: newSocket
              }
            )
            const query = `Update bed_information Set socket_slot_${index + 1
              } = ${index} where bed_id = ${bedId}`
            await queryRunner.manager.getRepository(BedInformation).query(query)
            // Add history
            await this.txHistoryService.addHistory({
              type: ACTION_TYPE.OPEN_SOCKET,
              targetType: bedByOwner.nft_type,
              userId: availableBalance.userId,
              symbol: availableBalance.symbol,
              amount: FREE.toString(),
              nftId: bedId ? bedId : null,
              tokenId: bedByOwner.token_id,
              tokenAddress: process.env.SLFT_ADDRESS,
              beforeBalance: availableBalance.availableAmount,
              currentBalance: new BigNumber(availableBalance.availableAmount)
                .minus(FREE)
                .toString()
            })
            await queryRunner.commitTransaction()
            return {
              status: 200,
              message: 'Success!'
            }
          } else {
            throw new Error('You are not level enough to open socket!')
          }
        }
        throw new Error('Not Socket')
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        queryRunner.release()
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findJewelByOwner(owner: string, jewelId: number) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select(['na.id'])
      .leftJoin('nfts', 'n', 'n.id = na.nft_id')
      .where('na.owner = :owner', { owner })
      .andWhere('n.id = :id', { id: jewelId })
      .andWhere('n.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
      .andWhere('n.category_id = :category_id', {
        category_id: CATEGORY_ID.JEWEL
      })
      .getRawOne()
  }

  async addJewelsForBed(owner: string, listJewelOwnerDto: ListJewelOwnerDto) {
    const { bedId, jewelId, index } = listJewelOwnerDto
    const checkJewel = await this.checkJewelByOwner(owner)
    if (!checkJewel) {
      throw new BadRequestException(MESSAGE.you_have_no_gems_to_assign)
    }
    const findJewelByOwner = await this.findJewelByOwner(owner, jewelId)
    if (!findJewelByOwner) {
      throw new BadRequestException(MESSAGE.nft_not_found_or_jewel_is_used)
    }
    const findBedInfor = await this.bedInformationRepository
      .createQueryBuilder('bi')
      .select([
        'bi.bed_id',
        'bi.jewel_slot_1 as jewel_slot_1',
        'bi.jewel_slot_2 as jewel_slot_2',
        'bi.jewel_slot_3 as jewel_slot_3',
        'bi.jewel_slot_4 as jewel_slot_4',
        'bi.jewel_slot_5 as jewel_slot_5',
        'bi.socket as socket'
      ])
      .leftJoin('nft_attributes', 'na', 'na.nft_id = bi.bed_id')
      .where('na.owner = :owner', { owner })
      .andWhere('bi.bed_id = :bed_id', { bed_id: bedId })
      .getRawOne()

    const arrJewel = [
      findBedInfor.jewel_slot_1,
      findBedInfor.jewel_slot_2,
      findBedInfor.jewel_slot_3,
      findBedInfor.jewel_slot_4,
      findBedInfor.jewel_slot_5
    ]
    if (findBedInfor.socket == arrJewel.filter((i) => isNumber(i)).length) {
      throw new BadRequestException(MESSAGE.no_socket_to_add_jewel)
    }
    // for (let i = 0; i < arrJewel.length; i++) {
    if (findBedInfor.socket == 0 || !findBedInfor?.socket) {
      throw new BadRequestException(MESSAGE.the_bed_has_not_been_opened_socket)
    }
    if (arrJewel[index] != null)
      throw new BadRequestException(MESSAGE.no_socket_to_add_jewel)
    // Create Transaction
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const query = `Update bed_information Set jewel_slot_${index + 1
        } = ${jewelId}, enable_jewel = true where bed_id = ${bedId} and socket_slot_${index + 1
        } = ${index}`
      const addJewel = await queryRunner.manager
        .getRepository(BedInformation)
        .query(query)
      if (addJewel.changedRows == 0) {
        throw new BadRequestException('Socket is not open ')
      }
      await queryRunner.manager
        .getRepository(Nfts)
        .update({ id: jewelId }, { isLock: IS_LOCK.USED })
      await queryRunner.commitTransaction()
      return {
        status: 200,
        message: 'Success!'
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new BadRequestException('Error ' + error)
    } finally {
      queryRunner.release()
    }
  }

  async removeJewelForBed(owner: string, listJewelOwnerDto: ListJewelOwnerDto) {
    try {
      const { bedId, jewelId, index } = listJewelOwnerDto
      const findBedInfor = await this.bedInformationRepository
        .createQueryBuilder('bi')
        .select([
          'bi.bed_id',
          'bi.jewel_slot_1 as jewel_slot_1',
          'bi.jewel_slot_2 as jewel_slot_2',
          'bi.jewel_slot_3 as jewel_slot_3',
          'bi.jewel_slot_4 as jewel_slot_4',
          'bi.jewel_slot_5 as jewel_slot_5',
          'na.nft_type as nft_type',
          'na.token_id as token_id'
        ])
        .leftJoin('nft_attributes', 'na', 'na.nft_id = bi.bed_id')
        .where('na.owner = :owner', { owner })
        .andWhere('bi.enable_jewel = true')
        .andWhere('bi.bed_id = :bed_id', { bed_id: bedId })
        .getRawOne()

      if (!findBedInfor) throw new Error("Don't have jewel in bed")
      const arrJewel = [
        findBedInfor.jewel_slot_1,
        findBedInfor.jewel_slot_2,
        findBedInfor.jewel_slot_3,
        findBedInfor.jewel_slot_4,
        findBedInfor.jewel_slot_5
      ]
      const availableBalance = await this.checkBalanceByOwner(owner)
      // const availableAmountBalances = new BigNumber(availableBalance.availableAmount)
      // const amountBalances = new BigNumber(availableBalance.amount)
      // if (availableAmountBalances.isLessThan(FREE) && amountBalances.isLessThan(FREE)) {
      //   throw new Error(MESSAGE.balance_not_enough + `_to_remove_jewel`);
      // }
      // for (let i = 0; i < arrJewel.length; i++) {
      if (arrJewel[index] == jewelId) {
        // Create Transaction
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
          const removeJewelQuery = `Update bed_information Set jewel_slot_${index + 1
            } = null where bed_id = ${bedId}`
          await queryRunner.manager
            .getRepository(BedInformation)
            .query(removeJewelQuery)
          await queryRunner.manager
            .getRepository(Nfts)
            .update({ id: jewelId }, { isLock: IS_LOCK.NOT_LOCK })
          // if (resultQuery.changedRows == 1) {
          //   await this.updateAmount(owner, FREE, queryRunner)

          // Add history
          await this.txHistoryService.addHistory({
            type: ACTION_TYPE.REMOVE_JEWEL,
            targetType: findBedInfor.nft_type,
            userId: availableBalance.userId,
            symbol: availableBalance.symbol,
            amount: '0',
            nftId: bedId ? bedId : null,
            tokenId: findBedInfor.token_id,
            tokenAddress: process.env.SLFT_ADDRESS,
            beforeBalance: availableBalance.availableAmount,
            currentBalance: availableBalance.availableAmount
          })
          // }
          if (arrJewel.filter(Number).length == 1) {
            const query = `Update bed_information Set enable_jewel = false where bed_id = ${bedId}`
            await queryRunner.manager.getRepository(BedInformation).query(query)
          }
          await queryRunner.commitTransaction()
          return {
            status: 200,
            message: 'Success!'
          }
        } catch (error) {
          await queryRunner.rollbackTransaction()
          throw new Error(error)
        } finally {
          queryRunner.release()
        }
      }
      //  }
      throw new Error(MESSAGE.no_jewel_to_remove)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async listBedBoxByOwner(owner: string) {
    const resultData = await this.nftAttributesRepository
      .createQueryBuilder('na')
      .leftJoinAndSelect('na.nft', 'n', 'na.nftId = n.id')
      .where('na.nft_type = :type', { type: NFT_TYPE.BED_BOX })
      .andWhere('na.owner = :owner', { owner })
      .andWhere('na.is_burn = :is_burn', { is_burn: IS_BURN.FALSE })
      .getMany()

    return resultData.map((x) => {
      const imagesSplited = x.image.split('/')
      x['bed_box_type'] = imagesSplited.pop().replace(/[^0-9]/g, '')
      return x
    })
  }

  async checkBedBoxByOwner(owner: string, bedboxId: number) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select([
        'na.nft_id as bedboxId',
        'na.parent_1 as parent_1',
        'na.parent_2 as parent_2',
        'na.contract_address as contractAddress',
        'na.quality as quality',
        'na.class as class',
        'na.owner as owner',
        'na.token_id as tokenId',
        'n.id as nftId'
      ])
      .leftJoin('nfts', 'n', 'na.nft_id = n.id')
      .where('na.nft_id = :nft_id', { nft_id: bedboxId })
      .andWhere('na.nft_type = :type', { type: NFT_TYPE.BED_BOX })
      .andWhere('na.owner = :owner', { owner })
      .andWhere('n.is_lock = :is_lock', { is_lock: IS_LOCK.NOT_LOCK })
      .andWhere('na.is_burn = :is_burn', { is_burn: IS_BURN.FALSE })
      .getRawOne()
  }

  async getClassOfParent1(parent1: number) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select(['na.nft_id as parent_1', 'na.class as class'])
      .where('na.nft_id = :parent_1', { parent_1: parent1 })
      .getRawOne()
  }

  async getClassOfParent2(parent2: number) {
    return await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select(['na.nft_id as parent_2', 'na.class as class'])
      .where('na.nft_id = :parent_2', { parent_2: parent2 })
      .getRawOne()
  }

  async openBedBox(owner: string, bedboxId: number) {
    const checkBedboxByOwner = await this.checkBedBoxByOwner(owner, bedboxId)
    if (!checkBedboxByOwner) {
      throw new Error(MESSAGE.do_not_own_the_bedbox)
    }
    const getMaxTokenId = await this.nftAttributesRepository.find({
      where: {
        nftType: NFT_TYPE.BEDS
      },
      order: {
        tokenId: 'DESC'
      }
    })
    try {
      let newBed
      let handleNft
      let parent1
      let parent2
      let classNft
      let quality
      await this.connection.transaction(async (entityManager) => {
        const newNft = new Nfts()
        newNft.categoryId = CATEGORY_ID.BED
        newNft.isLock = 0
        newNft.status = 'DEFAULT'
        const nft = await entityManager.save(newNft)
        if (checkBedboxByOwner.parent_1 && checkBedboxByOwner.parent_2) {
          //open bedbox from minting
          const randomQualityWithPercent = await getRandomWithPercent([
            { value: checkBedboxByOwner.quality, percent: PERCENT_QUALITY }
          ])
          if (!randomQualityWithPercent) {
            throw new Error(MESSAGE.not_random_quality)
          }
          const getClassOfParent1 = await this.getClassOfParent1(
            checkBedboxByOwner.parent_1
          )
          const getClassOfParent2 = await this.getClassOfParent2(
            checkBedboxByOwner.parent_2
          )

          const randomClassWithPercent = await getRandomWithPercent([
            { value: getClassOfParent1.class, percent: PERCENT_CLASS },
            { value: getClassOfParent2.class, percent: PERCENT_CLASS }
          ])

          if (!randomClassWithPercent) {
            throw new Error(MESSAGE.not_random_quality)
          }
          handleNft = await genNftAttributeJson(
            CATEGORY_ID.BED,
            nft.id,
            randomClassWithPercent,
            checkBedboxByOwner.owner,
            checkBedboxByOwner.contractAddress,
            getMaxTokenId[0].tokenId + 1,
            0,
            randomQualityWithPercent
          )
          parent1 = checkBedboxByOwner.parent_1
          parent2 = checkBedboxByOwner.parent_2
          classNft = randomClassWithPercent
          quality = randomQualityWithPercent
        } else {
          //open bedbox from luckybox
          const randomClass = await getRandomWithPercent(
            BED_CLASS_FROM_LUCKY_BOX
          )
          const findBedbox = await this.nftAttributesRepository.findOne({
            nftId: bedboxId
          })
          handleNft = await genNftAttributeJson(
            CATEGORY_ID.BED,
            nft.id,
            randomClass,
            owner,
            process.env.BED_CONTRACT,
            getMaxTokenId[0].tokenId + 1,
            0,
            findBedbox.quality
          )
          parent1 = null
          parent2 = null
          classNft = randomClass
          quality = findBedbox.quality
        }
        const newNftAttribute = new NftAttributes()
        newNftAttribute.nftId = nft.id
        newNftAttribute.nftName = handleNft.nftName
        newNftAttribute.name = handleNft.name
        newNftAttribute.parent1 = parent1
        newNftAttribute.parent2 = parent2
        newNftAttribute.image = handleNft.image
        newNftAttribute.contractAddress = process.env.BED_CONTRACT
        newNftAttribute.type = 'bed'
        newNftAttribute.nftType = 'bed'
        newNftAttribute.isMint = 1
        newNftAttribute.isBurn = IS_BURN.FALSE
        newNftAttribute.classNft = classNft
        newNftAttribute.quality = quality
        newNftAttribute.owner = checkBedboxByOwner.owner
        newNftAttribute.time = 0
        newNftAttribute.level = 0
        newNftAttribute.bedMint = 0
        newNftAttribute.efficiency = handleNft.efficiency
        newNftAttribute.luck = handleNft.luck
        newNftAttribute.bonus = handleNft.bonus
        newNftAttribute.special = handleNft.special
        newNftAttribute.resilience = handleNft.resilience
        newNftAttribute.tokenId = getMaxTokenId[0].tokenId + 1
        newNftAttribute.durability = 100
        newBed = await entityManager.save(newNftAttribute)
        newBed['startTime'] = BED_TYPE_TIME[newBed.classNft.toUpperCase()]?.Min
        newBed['endTime'] = BED_TYPE_TIME[newBed.classNft.toUpperCase()]?.Max

        await entityManager.update(
          Nfts,
          { id: checkBedboxByOwner.nftId },
          { isLock: IS_LOCK.USED }
        )
        await entityManager.update(
          NftAttributes,
          { nftId: checkBedboxByOwner.bedboxId },
          { isBurn: 1 }
        )
        //insert nft level up
        const newNftLevelUp = new NftLevelUp()
        newNftLevelUp.bedId = nft.id
        newNftLevelUp.levelUpTime = await (
          await getLevel(newBed.level)
        ).level_time
        newNftLevelUp.status = NFT_LEVEL_UP_STATUS.PENDING
        await entityManager.save(newNftLevelUp)
      })

      newBed.image = `${PATH_IMG[newBed.nftType]}${newBed.image}`
      return newBed
    } catch (error) {
      console.log('===============error==========:', error)
      throw new Error(MESSAGE.failed_to_open_bedbox)
    }
  }

  async listBedByOwnerInHomePage(
    owner: string,
    listNftsInHomePageDto: ListNftsInHomePageDto,
    userId: number,
  ) {
    const lastTracking = await this.trackingRepository
      .findOne(
        {
          where: {
            userId,
            status: STATUS_TRACKING.WOKE_UP,
          },
          order: {
            createdAt: 'DESC',
          }
        }
      )

    const { limit, page } = listNftsInHomePageDto
    const listNft = await this.nftAttributesRepository
      .createQueryBuilder('nftAttributes')
      .innerJoinAndSelect(
        'nftAttributes.nft',
        'nfts',
        'nftAttributes.nftId = nfts.id'
      )
      .leftJoinAndSelect('nfts.sales', 'saleNft')
      // .leftJoinAndSelect('nfts.levelUp', 'nftLevelup')
      .where(`nftAttributes.owner = '${owner}'`)
      .andWhere('nftAttributes.is_burn = :isBurn', { isBurn: IS_BURN.FALSE })
      .andWhere('nfts.category_id = :category_id', {
        category_id: CATEGORY_ID.BED
      })
      .andWhere('nftAttributes.nft_type = :nft_type', {
        nft_type: NFT_TYPE.BEDS
      })
      .andWhere('nfts.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
      // .andWhere('nftLevelup.status != :status', { status: NFT_LEVEL_UP_STATUS.PROCESSING })
      .limit(limit)
      .offset(limit * (page - 1))

    if (lastTracking) {
      listNft.addOrderBy(`nftAttributes.nftId = ${lastTracking.bedUsed}`, 'DESC')
    }

    listNft.addOrderBy('nftAttributes.updated_at', 'DESC')


    const [_list, count] = await Promise.all([
      listNft.getMany(),
      listNft.getCount()
    ])

    const list = await Promise.all(
      _list.map(async (x) => {
        const waitingTime = await this.getWaitingTime(x.nftId)

        const checkLevelMint = await this.checkLevelMint(x.nftId)
        x.efficiency = parseFloat(x.efficiency.toString())
        x.luck = parseFloat(x.luck.toString())
        x.bonus = parseFloat(x.bonus.toString())
        x.special = parseFloat(x.special.toString())
        x.resilience = parseFloat(x.resilience.toString())
        x.durability = parseFloat(x.durability.toString())
        x['waitingTime'] = waitingTime
        x['isLevelMint'] = checkLevelMint
        let objData = {}
        const nftSale = x.nft.sales ? x.nft.sales : null
        delete x.nft.sales
        if (x.nftType === NFT_TYPE.BEDS) {
          objData = {
            insurancePercent: INSURANCE_COST_PERCENT[_.lowerCase(x.quality)],
            startTime: BED_TYPE_TIME[x.classNft.toUpperCase()].Min,
            endTime: BED_TYPE_TIME[x.classNft.toUpperCase()].Max
          }
        }
        const data = { ...x, nftSale, objData }
        return data
      })
    )
    return { list, count }
  }

  async getTokenId(type: string) {
    let tokenId = 1
    const nft = await this.nftAttributesRepository.findOne({
      where: { nftType: type },
      order: { tokenId: 'DESC' }
    })
    if (!nft) return tokenId
    tokenId = Number(nft.tokenId) + 1
    return tokenId
  }

  async getTokenIdByCategory(categoryId: number, manager: EntityManager) {
    let tokenId = 1
    const category = await manager
      .getRepository(Category)
      .findOne({ where: { id: categoryId } })
    if (!category) return tokenId
    const nft = await manager
      .getRepository(NftAttributes)
      .findOne({
        where: { nftType: category.name },
        order: { tokenId: 'DESC' }
      })
    if (!nft) return tokenId
    tokenId = Number(nft.tokenId) + 1
    return tokenId
  }

  async getUserWalletByUserId(userId: number) {
    return this.connection.manager.getRepository(User).findOne({
      where: {
        id: userId
      }
    })
  }

  async sendOneBedToUser(userWallet) {
    const adminWallet = process.env.OWNER_NFT_WALLET
    const nft = await this.nftAttributesRepository
      .createQueryBuilder('nftAttribute')
      .leftJoin('nftAttribute.nft', 'nfts', 'nftAttribute.nftId = nfts.id')
      .where('nftAttribute.owner = :owner', { owner: adminWallet.toString() })
      .andWhere(`nfts.category_id = :category_id`, {
        category_id: CATEGORY_ID.BED
      })
      .andWhere('nfts.is_lock = :isLock AND nftAttribute.is_burn = :isBurn', {
        isLock: IS_LOCK.NOT_LOCK,
        isBurn: IS_BURN.FALSE
      })
      .getOne()

    if (!nft) return

    await this.nftAttributesRepository.update(
      { tokenId: nft.tokenId },
      { owner: userWallet }
    )
  }
}
