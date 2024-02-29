import 'dotenv/config'

import {abi} from "../src/common/Utils";
import {getBlockNumber, getContract, timeOut} from "../src/common/Web3";
import BlocksService from "./services/BlocksService";
import DepositService from "./services/DepositService";

export default class BaseCrawler {
  public abi: any
  public provider: string
  public contract: string
  public web3Contract: any
  public startBlock: number
  public providers: string

  constructor() {
    this.contract = process.env.CONTRACT_TREASURY
    this.abi = abi
    this.startBlock = Number(process.env.CONTRACT_TREASURY_START_BLOCK)
    this.provider = process.env.PROVIDER_CRAWLER

    this.web3Contract = getContract(abi, this.provider, this.contract)
  }

  async crawlBlock(fromBlock: number, toBlock: number) {
    try {
      console.log('====================================')
      console.log(`Crawl contract:  ${this.contract}`)
      console.log('from', fromBlock)
      console.log('to', toBlock)
      console.log('====================================')
      const events = await this.web3Contract.getPastEvents('AllEvents', {
        fromBlock: fromBlock,
        toBlock: toBlock
      })
      await BlocksService.createBlock(this.contract, fromBlock, toBlock)
      for (const event of events) {
        console.log('event', event)
        await this.handleEvent(event)
      }
    } catch (error) {
      console.log(error.toString())

      return
    }
  }

  async handleEvent(event: any) {
    if (event.event === 'LogLockToken') {
      await DepositService.depositToken(event)
    }

    if (event.event === 'LogLockNft') {
      await DepositService.depositNft(event)
    }
  }

  async getLatestCrawlBlock() {
    const block = await BlocksService.getBlock(this.contract)
    return block?.block > 0 ? block.block + 1 : this.startBlock
  }

  async scan() {
    const MaxBlockRange = 500
    let getLatestCrawlBlock = await this.getLatestCrawlBlock()
    await timeOut(async () => {
      try {
        let latestBlock = null
        try {
          latestBlock = await getBlockNumber(this.provider)
        } catch (error) {
          console.log(error)
        }
        if (!latestBlock) return

        latestBlock = Math.min(
          latestBlock - 5,
          getLatestCrawlBlock + MaxBlockRange
        )

        if (latestBlock > getLatestCrawlBlock) {
          await this.crawlBlock(getLatestCrawlBlock, latestBlock)
          getLatestCrawlBlock = latestBlock + 1
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  async checkTxProcessing() {
    await timeOut( async () => {
      await DepositService.checkTXProcessing()
    })
  }
}
