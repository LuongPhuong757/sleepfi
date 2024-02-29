import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import Client from "ioredis";
import _ from 'lodash'
import Redlock, { ExecutionError } from 'redlock';
import { sleep } from 'src/common/Web3'
import { NftAttributes } from 'src/databases/entities/nft_attributes.entity'
import { IS_LOCK } from 'src/nft-attributes/constants'
import { NftAttributesSevice } from 'src/nft-attributes/nft-attributes.service'
import {
  INSURANCE_COST_PERCENT,
  NFT_TYPE,
  SORT_PRICE
} from 'src/nfts/constants'
import { NftSevice } from 'src/nfts/nfts.service'
import { SpendingBalancesSevice } from 'src/spending_balances/spending_balances.service'
import { UserRepository } from 'src/user/repositories/user.repository'
import { Connection } from 'typeorm'

import { NftSales } from '../databases/entities/nft_sales.entity'
import { User } from '../databases/entities/user.entity'
import { RequestContext } from '../shared/request-context/request-context.dto'
import { BED_TYPE_TIME } from '../tracking/constants'
import { ACTION_TYPE } from '../tx-history/constant'
import { TxHistorySevice } from '../tx-history/tx-history.service'
import { SALE_NFT_STATUS } from './constant'
import { BuyNftsInMarketPlaceDto } from './dto/buy-nft.dto'
import { ListNftsInMarketPlaceDto } from './dto/list-nft.dto'
import { MarketPlaceRepository } from './market-place.repository'

@Injectable()
export class MarketPlaceSevice {

  private redClient: Client;
  private redLock: Redlock;

  constructor(
    private readonly marketPlaceRepository: MarketPlaceRepository,
    private readonly userRepository: UserRepository,
    private readonly nftAttributesService: NftAttributesSevice,
    private readonly nftService: NftSevice,
    private readonly spendingBalancesSevice: SpendingBalancesSevice,
    private readonly txHistoryService: TxHistorySevice,
    private readonly connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.redClient = new Client({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) });
    this.redLock = new Redlock(
      // You should have one client for each independent redis node
      // or cluster.
      [this.redClient],
      {
        // The expected clock drift; for more details see:
        // http://redis.io/topics/distlock
        driftFactor: 0.01, // multiplied by lock ttl to determine drift time

        // The max number of times Redlock will attempt to lock a resource
        // before erroring.
        retryCount: 0,

        // the time in ms between attempts
        retryDelay: 0, // time in ms

        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 200, // time in ms

        // The minimum remaining time on a lock before an extension is automatically
        // attempted with the `using` API.
        automaticExtensionThreshold: 500, // time in ms
      }
    );
  }

  async getNftInMarketPlace(
    listNftsInMarketPlaceDto: ListNftsInMarketPlaceDto,
    ownerUser
  ) {
    const {
      page,
      limit,
      categoryId,
      sortPrice,
      type,
      classNft,
      quality,
      minLevel,
      maxLevel,
      minBedMint,
      maxBedMint
    } = listNftsInMarketPlaceDto
    const queryAllNftInMarket = this.marketPlaceRepository
      .createQueryBuilder('saleNfts')
      .leftJoinAndSelect('saleNfts.nft', 'nfts')
      .leftJoinAndSelect('nfts.attribute', 'nft_attributes')
      .leftJoinAndSelect('nft_attributes.author', 'user')
      .where(`saleNfts.status = :status`, { status: SALE_NFT_STATUS.ON_SALE })
      .andWhere(`nfts.is_lock = :isLock`, { isLock: IS_LOCK.ON_MARKET })
      .limit(limit)
      .offset(limit * (page - 1))


    // if (ownerUser) {
    //   queryAllNftInMarket.andWhere('nft_attributes.owner != :ownerUser', { ownerUser })
    // }

    if (sortPrice == SORT_PRICE.HIGH_PRICE) {
      queryAllNftInMarket.orderBy('cast(price as double)', 'DESC')
    }
    if (sortPrice == SORT_PRICE.LOW_PRICE) {
      queryAllNftInMarket.orderBy('cast(price as double)', 'ASC')
    }
    if (sortPrice == SORT_PRICE.LATEST) {
      queryAllNftInMarket.orderBy('saleNfts.updated_at', 'DESC')
    }

    if (!categoryId) return { list: [], count: 0 }
    queryAllNftInMarket.andWhere('nfts.category_id = :categoryId', {
      categoryId
    })
    if (minLevel >= 0 && maxLevel >= 0) {
      queryAllNftInMarket.andWhere(
        `nft_attributes.level between ${minLevel} and ${maxLevel}`
      )
    }
    if (minBedMint >= 0 && maxBedMint >= 0) {
      queryAllNftInMarket.andWhere(
        `nft_attributes.bed_mint between ${minBedMint} and ${maxBedMint}`
      )
    }
    switch (+categoryId) {
      case 1:
        if (type.length) {
          queryAllNftInMarket.andWhere('nft_attributes.type In (:type)', {
            type
          })
        }
        if (classNft.length) {
          queryAllNftInMarket.andWhere('nft_attributes.class In (:class)', {
            class: classNft
          })
        }
        if (quality.length) {
          queryAllNftInMarket.andWhere('nft_attributes.quality In (:quality)', {
            quality
          })
        }
        break
      case 2:
        if (type.length) {
          if (type.includes('genesis_jewel') && !type.includes('jewel')) {
            queryAllNftInMarket.andWhere(`nft_attributes.name like 'G%'`)
          }
          if (type.includes('jewel') && !type.includes('genesis_jewel')) {
            queryAllNftInMarket.andWhere(`nft_attributes.name not like 'G%'`)
          }
          if (type.includes('jewel') && type.includes('genesis_jewel')) {
            queryAllNftInMarket.andWhere('nft_attributes.nft_type In (:type)', {
              type
            })
          }
        }
        if (classNft.length) {
          queryAllNftInMarket.andWhere(
            'nft_attributes.jewel_type In (:classNft)',
            { classNft }
          )
        }
        break
      default:
        if (type.length) {
          queryAllNftInMarket.andWhere('nft_attributes.item_type In (:type)', {
            type
          })
        }
        break
    }

    queryAllNftInMarket.addOrderBy('nft_attributes.nft_id', 'ASC')
    const [_list, count] = await Promise.all([
      queryAllNftInMarket.getMany(),
      queryAllNftInMarket.getCount()
    ])

    const list = _list.map((x) => {
      const nftAttribute = x.nft.attribute
      const nft = {
        category_id: x.nft.categoryId,
        is_lock: x.nft.isLock,
        status: x.status,
        price: x.price,
        transaction_fee: x.transactionsFee,
        symbol: x.symbol,
        updatedAt: x.updatedAt,
        createdAt: x.createdAt
      }
      let otherData = {}
      if (nftAttribute.nftType === NFT_TYPE.BEDS) {
        otherData = {
          insurancePercent:
            INSURANCE_COST_PERCENT[_.lowerCase(nftAttribute.quality)],
          startTime: BED_TYPE_TIME[nftAttribute.classNft.toUpperCase()].Min,
          endTime: BED_TYPE_TIME[nftAttribute.classNft.toUpperCase()].Max
        }
      }

      const data = { ...nftAttribute, ...nft, ...otherData }

      data['owner_id'] = nftAttribute?.author?.id ?? null
      data.author = null
      return data
    })
    return { list, count }
  }

  async buyNftInMarketPlaceV2(
    buyNftsInMarketPlaceDto: BuyNftsInMarketPlaceDto,
    ctx: RequestContext
  ) {
    const { nftId } = buyNftsInMarketPlaceDto
    const key = `cart:${nftId}`;

    // check user during buy other nft, one user only buy one nft one time
    const buyerKey = `buy-${ctx.user.id}`;
    const userHasBuying = await this.cacheManager.get(buyerKey);
    if(userHasBuying)  {
      throw new BadRequestException('nft_is_not_on_sale');
    }

    // override TTL to 10 seconds
    await this.cacheManager.set(buyerKey, nftId, {
      ttl: 10
    });

    try {
      const hasNFTSale = await this.connection.manager
        .getRepository(NftSales)
        .createQueryBuilder('ns')
        .where('ns.nft_id = :nftId', { nftId })
        .andWhere('ns.status = :statusSale', {
          statusSale: SALE_NFT_STATUS.ON_SALE
        })
        .getOne()
      if (!hasNFTSale) throw new BadRequestException('nft_is_not_on_sale')

      // find nft attributes
      const nftAttributes = await this.connection.manager
        .getRepository(NftAttributes)
        .findOne({ nftId })

      // get seller and buyer balance
      const seller = await this.connection.manager
        .getRepository(User)
        .findOne({ where: { wallet: nftAttributes.owner } })
      const buyer = await this.connection.manager
        .getRepository(User)
        .findOne(ctx.user.id)
      if (
        buyer?.wallet?.toLowerCase() === nftAttributes?.owner?.toLowerCase() ||
        buyer?.wallet?.toLowerCase() === seller?.wallet?.toLowerCase()
      ) {
        throw new BadRequestException('Not buy')
      }

      // check buyer balance
      const cBuyerBalance = await this.spendingBalancesSevice.buyerHasEnoughBalance(buyer.id, seller.id, hasNFTSale.price, hasNFTSale.transactionsFee, this.connection.manager);
      if(!cBuyerBalance) throw new BadRequestException('Not buy');

      // override TTL to 10000 milliseconds
      const lock = await this.redLock.acquire([key], 10000);

      // get order transaction
      const orderInfo = await this.spendingBalancesSevice.balanceAmountV3(
        buyer.id,
        seller.id,
        hasNFTSale.price,
        hasNFTSale.transactionsFee,
        this.connection.manager, 
        nftId,
        buyer.wallet,
        seller.wallet);

      // update status of nft sale
      await this.connection.manager
        .createQueryBuilder()
        .update(NftSales)
        .set({ status: SALE_NFT_STATUS.NOT_ON_SALE })
        .where('nft_id = :nft_id', { nft_id: nftId })
        .execute();
        
    return {
      status: true,
      message: 'Buy success!',
      data: orderInfo
    } 

    } catch (error) {
      if (error instanceof (ExecutionError)) {
        throw new BadRequestException('Nft is not on sale.');
      }
      throw error;
    } finally {
      await this.cacheManager.del(buyerKey);
    }
  }
}
