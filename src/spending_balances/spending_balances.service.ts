import { InjectQueue } from '@nestjs/bull'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BigNumber } from 'bignumber.js'
import { Queue } from 'bull'
import { MESSAGE } from 'src/common/messageError'
import MsgHelper from 'src/common/MessageUtils'
import { MarketOrders } from 'src/databases/entities/market-orders.entity'
import { NftSales } from 'src/databases/entities/nft_sales.entity'
import { User } from 'src/databases/entities/user.entity'
import { STATUS_SELL, TOKEN_MARKET } from 'src/market-place/constant'
import { NftResponseType } from 'src/nfts/constants'
import { PROFIT_TYPE } from 'src/profit/constants'
import { ProfitSevice } from 'src/profit/profit.service'
import { TOKEN_SYMBOL } from 'src/stack_details/enum'
import { EntityManager } from 'typeorm'
import { QueryRunner } from 'typeorm/query-runner/QueryRunner'

import { SpendingBalances } from '../databases/entities/spending_balances.entity'
import { SpendingBalancesRepository } from './spending_balances.repository'

export interface SellNftQueue {
  id?: number
  seller?: number,
  buyer?: number,
  nftId?: number
  status?: string
  symbol?: string
  createdAt?: Date
  updatedAt?: Date
  amount?: string | null
  fee?: string | null,
  buyerWallet: string,
  sellerWallet: string
}

@Injectable()
export class SpendingBalancesSevice {
  constructor(
    private readonly spendingBalancesRepository: SpendingBalancesRepository,
    @InjectQueue('market-orders') private sellNftQueue: Queue,
    private profitService: ProfitSevice,
  ) { }

  async balanceAmount(
    buyerId: number,
    sellerId: number,
    priceNft: string,
    transactionsFee: string,
    manager: EntityManager
  ) {
    const buyerSpending = await manager
      .getRepository(SpendingBalances)
      .createQueryBuilder('sb')
      .setLock('pessimistic_write')
      .where('sb.userId = :buyerId', { buyerId })
      .andWhere('sb.tokenAddress = :tokenAddress', {
        tokenAddress: process.env.AVAX_ADDRESS
      })
      .getOne()

    const sellerSpending = await manager
      .getRepository(SpendingBalances)
      .createQueryBuilder('sb')
      .setLock('pessimistic_write')
      .where('sb.userId = :sellerId', { sellerId })
      .andWhere('sb.tokenAddress = :tokenAddress', {
        tokenAddress: process.env.AVAX_ADDRESS
      })
      .getOne()

    if (!buyerSpending || !sellerSpending)
      throw new BadRequestException(`You don't have a wallet account yet!`)
    const buyerAmount = new BigNumber(buyerSpending.amount)
    const buyerAvailableAmount = new BigNumber(buyerSpending.availableAmount)
    const sellerAvailableAmount = new BigNumber(sellerSpending.availableAmount)
    const nftPrice = new BigNumber(priceNft)
    const totalFee = new BigNumber(priceNft)
      .div(100)
      .times(transactionsFee)
      .toString()
    if (nftPrice.isGreaterThan(buyerAvailableAmount))
      throw new BadRequestException('Not enough to buy')

    const buyerBalancesAmount = buyerAmount.minus(nftPrice)
    const buyerBalancesAmountAvailable = buyerAvailableAmount.minus(nftPrice)
    const sellerBalances = sellerAvailableAmount.plus(priceNft).minus(totalFee)

    await manager.update(
      SpendingBalances,
      { walletId: buyerSpending.walletId },
      {
        availableAmount: buyerBalancesAmountAvailable.toString(),
        amount: buyerBalancesAmount.toString()
      }
    )

    await manager.update(
      SpendingBalances,
      { walletId: sellerSpending.walletId },
      {
        amount: sellerBalances.toString(),
        availableAmount: sellerBalances.toString()
      }
    )

    return {
      beforeBalance: buyerAvailableAmount,
      newBalance: buyerBalancesAmountAvailable
    }
  }

  async updateBalanceWithTxManager(
    amount: string,
    symbol: string,
    userId: number,
    queryRunner: QueryRunner
  ) {
    const spendingBalances = await queryRunner.manager
      .getRepository(SpendingBalances)
      .createQueryBuilder('sb')
      .setLock('pessimistic_write')
      .where('sb.walletId = :walletId', {
        walletId: userId + symbol
      })
      .getOne()
    if (!spendingBalances)
      throw new BadRequestException('Spending Balances not found')
    const beforeBalance = spendingBalances.availableAmount;
    spendingBalances.amount = new BigNumber(amount)
      .plus(spendingBalances.amount)
      .toString()
    spendingBalances.availableAmount = new BigNumber(amount)
      .plus(spendingBalances.availableAmount)
      .toString()
    await queryRunner.manager
      .getRepository(SpendingBalances)
      .update(
      {
        symbol,
        userId
      },
      {
        amount: spendingBalances.amount,
        availableAmount: spendingBalances.availableAmount
      }
    )
    return {
      beforeBalance,
      currentBalance : spendingBalances.availableAmount,
    }
  }

  async plusAmoutSpending(amount: string, symbol, userId) {
    const spendingBalances = await SpendingBalances.findOne({ symbol, userId })
    if (!spendingBalances)
      throw new BadRequestException('Spending Balances not found')
    spendingBalances.amount = new BigNumber(spendingBalances.amount)
      .plus(amount)
      .toString()
    spendingBalances.availableAmount = new BigNumber(
      spendingBalances.availableAmount
    )
      .plus(amount)
      .toString()
    await spendingBalances.save()
    return spendingBalances
  }

  async balanceAmountv2(
    buyerId: number,
    sellerId: number,
    priceNft: string,
    transactionsFee: string,
    manager: EntityManager,
    nftId: number
  ) {
    // find user buy
    const buyerSpending = await manager
      .getRepository(SpendingBalances)
      .createQueryBuilder('sb')
      .where('sb.walletId = :walletId', {
        walletId: buyerId + TOKEN_MARKET.toLowerCase()
      })
      // .andWhere('sb.symbol = :symbol', { symbol: TOKEN_MARKET.toLowerCase()})
      // .setLock('pessimistic_write_or_fail')
      .getOne()

    // check user
    if (!buyerSpending)
      throw new BadRequestException(`You don't have a wallet account yet!`)
    const buyerAmount = new BigNumber(buyerSpending.amount)
    const buyerAvailableAmount = new BigNumber(buyerSpending.availableAmount)
    const nftPrice = new BigNumber(priceNft)

    // get fee transaction
    const totalFee = new BigNumber(priceNft)
      .div(100)
      .times(transactionsFee ? transactionsFee : 0)
      .toString()
    if (nftPrice.isGreaterThan(buyerAvailableAmount))
      throw new BadRequestException('Not enough to buy')

    const buyerBalancesAmount = buyerAmount.minus(nftPrice)
    const buyerBalancesAmountAvailable = buyerAvailableAmount.minus(nftPrice)
    const sellAmountBalanePlus = new BigNumber(nftPrice)
      .minus(totalFee)
      .toFixed()

    //plus amout for profit
    await this.profitService.processProfit(sellerId, TOKEN_MARKET.toLowerCase(), totalFee.toString(), PROFIT_TYPE.SELL_NFT, manager)

    const updateBalance = await manager.update(
      SpendingBalances,
      { walletId: buyerSpending.walletId },
      {
        availableAmount: buyerBalancesAmountAvailable.toFixed(),
        amount: buyerBalancesAmount.toFixed(),
      }
    );

    // check update balance
    if (!updateBalance || updateBalance.raw.affectedRows < 1) {
      throw new BadRequestException('Not enough to buy')
    }

    // update balance seller
    await manager
      .createQueryBuilder()
      .update(SpendingBalances)
      .set({
        availableAmount: () => `cast(available_amount as decimal(50, 10)) + ${sellAmountBalanePlus}`,
        amount: () => `cast(amount as decimal(50, 10)) + ${sellAmountBalanePlus}`
      })
      .where('walletId = :walletId', {
        walletId: sellerId + TOKEN_MARKET.toLowerCase()
      })
      .execute()
    return {
      beforeBalance: buyerAvailableAmount,
      newBalance: buyerBalancesAmountAvailable
    }
  }

  async minusTokenSpendingBalances(
    userId: number,
    symbol: string,
    amount: string
  ) {
    const spendingBalances = await SpendingBalances.findOne({
      userId: userId,
      symbol: symbol
    })
    if (!spendingBalances)
      throw new BadRequestException('Spending Balances not found')
    if (
      new BigNumber(spendingBalances.availableAmount).comparedTo(amount) == -1
    ) {
      throw new BadRequestException('Token number is not enough')
    } else {
      const beforeBalance = spendingBalances.availableAmount
      spendingBalances.amount = new BigNumber(spendingBalances.amount)
        .minus(amount)
        .toString()
      spendingBalances.availableAmount = new BigNumber(
        spendingBalances.availableAmount
      )
        .minus(amount)
        .toString()
      await spendingBalances.save()
      return {
        beforeBalance,
        newBalance: spendingBalances.availableAmount
      }
    }
  }

  async insertSpendingBalance(arrayToken, wallet, userId, queryRunner) {
    const newSpendingBalances = []
    await arrayToken.forEach((token) => {
      newSpendingBalances.push({
        walletId: `${userId}${token.name}`,
        amount: '0',
        availableAmount: '0',
        userId,
        symbol: token.name.toLowerCase(),
        wallet: wallet.toLowerCase(),
        tokenAddress: token.address.toLowerCase()
      })
    });
    await queryRunner.manager.getRepository(SpendingBalances).insert(newSpendingBalances)
  }

  async minusSpendingBalanceWithTokenAddress(wallet, tokenAddress, amount, availableAmount, feeAmount, feeAvailableAmount){
    await this.spendingBalancesRepository.update(
      {
        wallet: wallet,
        tokenAddress: tokenAddress
      },
      {
        amount: new BigNumber(amount).minus(feeAmount).toString(),
        availableAmount: new BigNumber(availableAmount).minus(feeAvailableAmount).toString()
      }
    )
  }

  async minusAvailableBalanceWithTokenAddress(wallet, tokenAddress, amount, fee){
    await this.spendingBalancesRepository.update(
      { wallet: wallet, tokenAddress },
      {
        availableAmount: new BigNumber(amount).minus(fee).toString()
      }
    )
  }

  async saveSpendingBalance(queryRunner: EntityManager, userBalance: SpendingBalances){
    await queryRunner.getRepository(SpendingBalances).save(userBalance);
  }

  async updateSpendingBanlances(
    spendingBalances,
    totalTokenToUpgrade,
    queryRunner: EntityManager){
      try {
        const updateSpendingBalances = spendingBalances.map((item) => {
          for (const key in totalTokenToUpgrade) {
            if (item.symbol == key) {
              if (item.availableAmount >= totalTokenToUpgrade[key]) {
                item.amount = new BigNumber(item.amount)
                  .minus(totalTokenToUpgrade[key])
                  .toString()
                item.availableAmount = new BigNumber(item.availableAmount)
                  .minus(totalTokenToUpgrade[key])
                  .toString()
              } else {
                throw new Error(MESSAGE.balance_not_enough)
              }
            }
          }
          return queryRunner.save(item)
        })
        return updateSpendingBalances
      } catch (error) {
        throw new Error(error)
      }
    }

  async minusTokenWithQueryRunner(userId: number, cost: number, totalSFLFT: number, manager: EntityManager) {
    const userBalance = await manager
      .getRepository(SpendingBalances)
      .createQueryBuilder('sb')
      .setLock('pessimistic_write')
      .where('sb.symbol = :symbol AND sb.userId = :userId', {
        symbol: TOKEN_SYMBOL.toLowerCase(),
        userId
      })
      .getOne()
    if (!userBalance) {
      throw new BadRequestException(MsgHelper.MsgList.insufficient_balance)
    }

    const balance = new BigNumber(userBalance.amount)
    const availableBalance = new BigNumber(userBalance.availableAmount)

    if (!balance || !availableBalance || availableBalance.isLessThan(cost)) {
      throw new BadRequestException(MsgHelper.MsgList.insufficient_balance)
    }
    const newBalance = new BigNumber(availableBalance.plus(totalSFLFT))
      .minus(cost)
      .toString()
    const newavailableBalance = new BigNumber(balance.plus(totalSFLFT))
      .minus(cost)
      .toString()

    userBalance.availableAmount = newBalance.toString()
    userBalance.amount = newavailableBalance.toString()
    manager.getRepository(SpendingBalances).save(userBalance)
    return {
      beforeBalance: balance,
      newBalance: newBalance
    }
  }

  async updateUserBalance(
    userBalance: SpendingBalances,
    cost: any,
    queryRunner: any
  ): Promise<NftResponseType> {
    const balance = new BigNumber(userBalance.amount)
    const availableBalance = new BigNumber(userBalance.availableAmount)
    const newCost = new BigNumber(cost)

    if (
      availableBalance.comparedTo(newCost) == -1 ||
      balance.comparedTo(newCost) == -1
    ) {
      throw new Error(MESSAGE.balance_not_enough)
    }

    userBalance.availableAmount = new BigNumber(
      availableBalance.minus(newCost)
    ).toString()
    userBalance.amount = new BigNumber(balance.minus(newCost)).toString()

    await queryRunner.manager.save(userBalance)
    return {
      beforeBalance: availableBalance.toString(),
      currentBalance: userBalance.availableAmount
    }
    //return userBalance;
  }

  async updateBalanceUpgrade(
    spendingBalances,
    totalTokenToUpgrade,
    queryRunner: EntityManager
  ) {
    const plusProfits = []
    const user = await User.findOne({ wallet: spendingBalances[0].wallet })
    const updateSpendingBalances = await spendingBalances.map((item) => {
      if (totalTokenToUpgrade[item.symbol]) {
        if (item.availableAmount >= totalTokenToUpgrade[item.symbol]) {
          item.amount = new BigNumber(item.amount)
            .minus(totalTokenToUpgrade[item.symbol])
            .toString()
          item.availableAmount = new BigNumber(item.availableAmount)
            .minus(totalTokenToUpgrade[item.symbol])
            .toString()
          // plus amount for profit
          plusProfits.push(this.profitService.processProfit(user.id, item.symbol.toLowerCase(), totalTokenToUpgrade[item.symbol], PROFIT_TYPE.UPGRADE_NFT, queryRunner))
        } else {
          throw new Error(MESSAGE.balance_not_enough_to_upgrade)
        }
      }
      return item
    })
    await Promise.all(plusProfits)
    return queryRunner.save(updateSpendingBalances)
  }

  async buyerHasEnoughBalance(buyerId: number, sellerId: number, priceNft: string, transactionsFee: string, manager: EntityManager) {
    try {
      // find user buy
      const buyerSpending = await manager
        .getRepository(SpendingBalances)
        .createQueryBuilder('sb')
        .where('sb.walletId = :walletId', {
          walletId: buyerId + TOKEN_MARKET.toLowerCase()
        })
        .getOne()

      // check user
      if (!buyerSpending)
        throw new BadRequestException(`You don't have a wallet account yet!`)

      const buyerAvailableAmount = new BigNumber(buyerSpending.availableAmount)
      const nftPrice = new BigNumber(priceNft)

      // compare price with the available balance amount
      if (nftPrice.isGreaterThan(buyerAvailableAmount))
        throw new BadRequestException('Not enough to buy')

      return true;
    } catch (error) {
      throw error;
    }
  }

  async balanceAmountV3(
    buyerId: number,
    sellerId: number,
    priceNft: string,
    transactionsFee: string,
    manager: EntityManager,
    nftId: number,
    bWallet: string,
    sWallet: string
  ) {
    const nftPrice = new BigNumber(priceNft)
    const totalFee = new BigNumber(priceNft)
      .div(100)
      .times(transactionsFee ? transactionsFee : 0)
      .toString()

    //plus amout for profit
    await this.profitService.processProfit(sellerId, TOKEN_MARKET.toLowerCase(), totalFee.toString(), PROFIT_TYPE.SELL_NFT, manager);

    const sellNftQueue: SellNftQueue = {
      seller: sellerId,
      buyer: buyerId,
      nftId,
      amount: nftPrice.toString(),
      fee: totalFee,
      symbol: TOKEN_MARKET,
      status: STATUS_SELL.PENDING,
      buyerWallet: bWallet,
      sellerWallet: sWallet
    }

    // insert sell_nfts table
    await manager.insert(MarketOrders, sellNftQueue);

    // add queue
    await this.sellNftQueue.add('sellNfts', sellNftQueue);

    return sellNftQueue;
  }
}
