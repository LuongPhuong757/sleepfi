import BigNumber from "bignumber.js";

import { convertWeiToEther } from "../../src/common/Web3";
import { WITHDRAW_STATUS } from "../../src/withdraw/constants";
import { TRANSACTION_TYPE } from "../constants/enum";
import { Nfts } from "../entities/Nft.entity";
import { NftAttributes } from "../entities/NftAttributes.entity";
import { SpendingBalances } from "../entities/SpendingBalance.entity";
import { TxHistories } from "../entities/TxHistories.entity";

export class DepositService {

  public async depositToken(event) {
    const params = event.returnValues
    const amountBignumber = await convertWeiToEther(params.amount)
    await this.insertTxHistories(params, event.transactionHash, amountBignumber)
  }

  public async checkTXProcessing() {
    const findTxHistory = await TxHistories.find({
      where: {
        type: TRANSACTION_TYPE.DEPOSIT_TOKEN,
        status: WITHDRAW_STATUS.PROCESSING,
      },
      take: 50
    })
    if (findTxHistory.length < 1) return
    await Promise.all(
        findTxHistory.map(async (item) => {
          await this.updateUserBalance(item.userId, item.tokenAddress, item.amount)
          item.status = WITHDRAW_STATUS.SUCCESS
          await item.save()
        })
    )
  }

  async updateUserBalance(userId, token, amount) {
    const userBalance = await this.getTokenBalanceOfUser(userId, token.toLowerCase())
    if (!userBalance) return

    userBalance.amount = new BigNumber(userBalance.amount).plus(amount).toString()
    userBalance.availableAmount = new BigNumber(userBalance.availableAmount).plus(amount).toString()
    await userBalance.save()
  }

  public async depositNft(event) {
    const params = event.returnValues
    const nft = await this.getNftById(params.collection.toLowerCase(), params.tokenId)
    if (!nft) return
    nft.owner = params.user
    await nft.save()
    await Nfts.update({ id: nft.nftId }, { isLock: 0 })
    await this.insertNFTTxHistories(event.transactionHash, params)
  }

  private async insertNFTTxHistories(tx, params) {
    const txHistories = new TxHistories();
    txHistories.tokenId = params.tokenId
    txHistories.contractAddress = params.collection.toLowerCase()
    txHistories.type = TRANSACTION_TYPE.DEPOSIT_NFT
    txHistories.tx = tx
    txHistories.status = WITHDRAW_STATUS.SUCCESS
    return await txHistories.save()
  }

  private async getTokenBalanceOfUser(userId: string, token: string) {
    return SpendingBalances.findOne({ where: { userId, tokenAddress: token } })
  }

  private async getNftById(contractAddress: string, tokenId: string) {
    return NftAttributes.findOne({ where: { contractAddress, tokenId } })
  }

  private async insertTxHistories(params, tx, amount) {
    const txHistories = new TxHistories();
    txHistories.userId = params.userId
    txHistories.tokenAddress = params.token;
    txHistories.amount = amount
    txHistories.type = TRANSACTION_TYPE.DEPOSIT_TOKEN
    txHistories.tx = tx
    txHistories.status = WITHDRAW_STATUS.PROCESSING
    return await txHistories.save()
  }
}

export default new DepositService()
