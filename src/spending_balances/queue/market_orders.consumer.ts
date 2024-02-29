import { Process, Processor } from '@nestjs/bull'
import BigNumber from 'bignumber.js'
import { TxHistories } from 'crawler/entities/TxHistories.entity'
import { MESSAGE } from 'src/common/messageError'
import { MarketOrders } from 'src/databases/entities/market-orders.entity'
import { Nfts } from 'src/databases/entities/nfts.entity'
import { NftAttributes } from 'src/databases/entities/nft_attributes.entity'
import { NftSales } from 'src/databases/entities/nft_sales.entity'
import { SpendingBalances } from 'src/databases/entities/spending_balances.entity'
import { SALE_NFT_STATUS, STATUS_SELL, TOKEN_MARKET } from 'src/market-place/constant'
import { Connection } from 'typeorm'

import { MarketOrderRepository } from '../market_order.respository'
import { SellNftQueue, SpendingBalancesSevice } from '../spending_balances.service'

@Processor('market-orders')
export class MarketOrderConsumer {
  constructor(
    private readonly marketOrderRepository: MarketOrderRepository,
    private readonly connection: Connection,
    private readonly spendingBalanceService: SpendingBalancesSevice
  ) { }

  @Process('sellNfts')
  async sellNfts(job: SellNftQueue) {
    console.log(`Begin - SellNftConsumer - sellNfts ${JSON.stringify(job)}`)
    // get data from queue
    job = job['data'] ? job['data'] : null

    // Create Transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!job) throw new Error('Fail');
      const nftId = job.nftId;
      const bWallet = job.buyerWallet;
      const sWallet = job.sellerWallet;

      // buyer
      const buyerBalance = await queryRunner
        .manager
        .getRepository(SpendingBalances)
        .createQueryBuilder('sb')
        // .setLock('pessimistic_write_or_fail')
        .where('sb.wallet_id = :walletId', {
          walletId: job.buyer + TOKEN_MARKET.toLowerCase()
        })
        .getOne();

      if (!buyerBalance) throw new Error('Not spending balances');

      // plus balance
      const nftPrice = new BigNumber(job.amount);
      const totalFee = new BigNumber(job.fee);

      // buyer balance
      const buyerAvailableAmount = new BigNumber(buyerBalance.availableAmount);

      // validation balance
      if (nftPrice.isGreaterThan(buyerAvailableAmount)) throw new Error('Not enough to buy');

      // seller balance
      const sellAmountBalanePlus = new BigNumber(nftPrice)
        .minus(totalFee)
        .toFixed()

      // update balance buyer
      await queryRunner
        .manager
        .createQueryBuilder()
        .update(SpendingBalances)
        .set({
          availableAmount: () => `cast(available_amount as decimal(50, 10)) - ${nftPrice.toFixed()}`,
          amount: () => `cast(amount as decimal(50, 10)) - ${nftPrice.toFixed()}`
        })
        .where('walletId = :walletId', {
          walletId: job.buyer + TOKEN_MARKET.toLowerCase()
        }).execute();

      // update balance seller
      await queryRunner
        .manager
        .createQueryBuilder()
        .update(SpendingBalances)
        .set({
          availableAmount: () => `cast(available_amount as decimal(50, 10)) + ${sellAmountBalanePlus}`,
          amount: () => `cast(amount as decimal(50, 10)) + ${sellAmountBalanePlus}`
        })
        .where('walletId = :walletId', {
          walletId: job.seller + TOKEN_MARKET.toLowerCase()
        }).execute()


      // update nft owner
      const nftAttribute = await queryRunner.manager
        .getRepository(NftAttributes)
        .createQueryBuilder('na')
        .where('na.nft_id = :nftId', { nftId })
        .getOne();
      if (bWallet.toLowerCase() === nftAttribute.owner.toLowerCase()) throw new Error(MESSAGE.do_not_buy_your_nft)
      if (sWallet.toLowerCase() !== nftAttribute.owner.toLowerCase()) throw new Error(MESSAGE.not_owner_nft)
      await queryRunner.manager.update(NftAttributes, nftAttribute.id, {
        owner: bWallet,
        updatedAt: new Date()
      });

      // update lock
      const nft = await queryRunner
        .manager
        .getRepository(Nfts)
        .findOne(nftId)
      if (!nft) throw new Error(MESSAGE.nft_not_found)

      await queryRunner
        .manager
        .getRepository(Nfts)
        .update(nft.id, {
        isLock: 0
      });

      // update status sell nfts
      await queryRunner.manager.getRepository(MarketOrders).update({ id: job.id }, { status: STATUS_SELL.SUCCESS });

      await queryRunner.commitTransaction();
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      // update status sell nfts
      await this.marketOrderRepository.update({ id: job.id }, { status: STATUS_SELL.FAIL, msgError: error.message });

      // update status of nft sale rollback nft to sale
      await this.connection
        .manager
        .createQueryBuilder()
        .update(NftSales)
        .set({ status: SALE_NFT_STATUS.ON_SALE })
        .where('nft_id = :nft_id', { nft_id: job.nftId })
        .execute()

      console.log('Error - SellNftQueue - sellNft ' + error);
    } finally {
      console.log('End - SellNftQueue - sellNft ');
      await queryRunner.release();
    }
  }
}
