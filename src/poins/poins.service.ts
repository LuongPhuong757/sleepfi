import { BadRequestException, Injectable } from '@nestjs/common'
import { BedHistoryRepository } from 'src/bed-history/bed-history.repository'
import { TYPE } from 'src/common/UserTransaction'
import { UserTransaction } from 'src/databases/entities/user_transaction.entity'
import { CATEGORY_ID, IS_LOCK } from 'src/nft-attributes/constants'
import { NftAttributesRepository } from 'src/nft-attributes/nft-attributes.repository'
import { NftRepository } from 'src/nfts/nfts.repository'

import { SYMBOL_TOKEN } from '../gacha/constant'
import { ACTION_TARGET_TYPE, ACTION_TYPE } from '../tx-history/constant'
import { TxHistorySevice } from '../tx-history/tx-history.service'
import { AddPoinDto } from './dto/add-poin.dto'
import { PoinsRepository } from './poins.repository'

@Injectable()
export class PoinsSevice {
  constructor(
    private readonly poinsRepository: PoinsRepository,
    private readonly nftAttributesRepository: NftAttributesRepository,
    private readonly bedHistoryRepository: BedHistoryRepository,
    private readonly nftRepository: NftRepository,
    private readonly txHistoryService: TxHistorySevice
  ) {}

  async poinsOfOwner(userId: number, bedId: number) {
    const getPoinsOfOwner = await this.poinsRepository.findOne({
      where: {
        bedId
      }
    })
    if (!getPoinsOfOwner) {
      throw new BadRequestException('You do not have points!')
    }
    return getPoinsOfOwner
  }

  async addPoinForJewel(userId: number, addPoinDto: AddPoinDto) {
    const { bedId, efficiency, luck, bonus, special, resilience } = addPoinDto
    const findBedById = await this.nftAttributesRepository
      .createQueryBuilder('na')
      .select([
        'na.efficiency as efficiency',
        'na.luck as luck',
        'na.bonus as bonus',
        'na.special as special',
        'na.resilience as resilience'
      ])
      .leftJoin('users', 'user', 'user.wallet = na.owner')
      .leftJoin('nfts', 'n', 'n.id = na.nft_id')
      .where('user.id = :id', { id: userId })
      .andWhere('na.nft_id = :nftId', { nftId: bedId })
      .andWhere('n.category_id = :category_id', {
        category_id: CATEGORY_ID.BED
      })
      .andWhere('n.is_lock = :isLock', { isLock: IS_LOCK.NOT_LOCK })
      .getRawOne()

    const getPoinByBedId = await this.poinsOfOwner(userId, bedId)
    if (!getPoinByBedId) {
      throw new BadRequestException('Bed not poins')
    }
    let sumPoin = 0
    const attChange = {}
    if (efficiency) {
      sumPoin += efficiency
      attChange['efficiency'] = +findBedById.efficiency + efficiency
    }
    if (luck) {
      sumPoin += luck
      attChange['luck'] = +findBedById.luck + luck
    }
    if (bonus) {
      sumPoin += bonus
      attChange['bonus'] = +findBedById.bonus + bonus
    }
    if (special) {
      sumPoin += special
      attChange['special'] = +findBedById.special + special
    }
    if (resilience) {
      sumPoin += resilience
      attChange['resilience'] = +findBedById.resilience + resilience
    }
    // for (const [key, value] of Object.entries(attChange)) {
    //   if (value > MAX_POIN) {
    //     throw new BadRequestException("Attribute's stat has reached max")
    //   }
    // }
    if (getPoinByBedId.bedPoint >= sumPoin) {
      await this.nftAttributesRepository
        .createQueryBuilder('na')
        .update()
        .set(attChange)
        .where('nft_id = :nftId', { nftId: bedId })
        .execute()

      await this.poinsRepository.update(
        { bedId },
        { bedPoint: getPoinByBedId.bedPoint - sumPoin }
      )
      const checkBedHistory = await this.bedHistoryRepository.findOne({
        where: {
          bedId
        }
      })
      if (!checkBedHistory) {
        await this.nftRepository.insertBedHistory(
          bedId,
          findBedById.efficiency,
          findBedById.luck,
          findBedById.bonus,
          findBedById.special,
          findBedById.resilience
        )
      }
      await this.txHistoryService.addHistory({
        userId,
        type: ACTION_TYPE.ADD_POINT,
        targetType: ACTION_TARGET_TYPE.BED,
        amount: '0',
        symbol: SYMBOL_TOKEN.SLFT,
        metaData: {
          efficiency,
          luck,
          bonus,
          special,
          resilience
        }
      })

      //insert user_transaction when add point
     const newPointTransaction= new UserTransaction
     newPointTransaction.type = TYPE.POINT_ADD
     newPointTransaction.userId = userId;
     newPointTransaction.nftId = bedId;
     newPointTransaction.pointAdd = sumPoin
     await newPointTransaction.save()
      return {
        status: 200,
        message: 'success'
      }
    } else {
      throw new BadRequestException('Not enough points')
    }
  }
}
