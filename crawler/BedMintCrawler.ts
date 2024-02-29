import 'dotenv/config'

import {getBlockNumber, getContract, timeOut} from "../src/common/Web3";
import { ERC721 } from './constants/abi';
import BlocksService from "./services/BlocksService";
import NftService from "./services/NftService";

export default class BedMintCrawler {
  public abi: any
  public provider: string
  public contract: string
  public web3Contract: any
  public startBlock: number
  public providers: string
  public flag: boolean

  constructor() {
    this.contract = process.env.BED_CONTRACT
    this.abi = ERC721
    this.startBlock = Number(process.env.BED_CONTRACT_START_BLOCK)
    this.provider = process.env.PROVIDER_CRAWLER
    this.flag = false;
    this.web3Contract = getContract(ERC721, this.provider, this.contract)
  }

  async crawlBlock(fromBlock: number, toBlock: number) {
    try {
      console.log('====================================')
      console.log(`Crawl contract:  ${this.contract}`)
      console.log('from', fromBlock)
      console.log('to', toBlock)
      console.log('====================================')
      const events = await this.web3Contract.getPastEvents('Transfer', {
        fromBlock: fromBlock,
        toBlock: toBlock
      })
      for (const event of events) {
        await NftService.getInstance().handleEventMintNft(event, "bed")
      }
      await BlocksService.createBlock(this.contract, fromBlock, toBlock)
    } catch (error) {
      console.log(error.toString())

      return
    }
  }

  async getLatestCrawlBlock() {
    const block = await BlocksService.getBlock(this.contract)
    return block?.block > 0 ? block.block + 1 : this.startBlock
  }

  async scan() {
    if (this.flag) return;
    this.flag = true;
    const MaxBlockRange = 5000
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
        this.flag = false;
      } catch (e) {
        this.flag = false;
        console.log(e)
      }
    })
  }
}
