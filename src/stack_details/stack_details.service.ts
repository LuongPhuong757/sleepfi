import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import {
  getEarningToken,
  getLevelUpDiscount,
  getMintingDiscount,
  getSlftPrice
} from 'src/common/Utils'
import { abi } from 'src/common/Utils'
import { StackCampaigns } from 'src/databases/entities/stack_campaigns.entity'
import { StackDetails } from 'src/databases/entities/stack_details.entity'
import { StackingSetting } from 'src/databases/entities/stacking_setting.entity'
import { Stakes } from 'src/databases/entities/stakes.entity'
import { TxHistories } from 'src/databases/entities/tx_histories.entity'
import { PROFIT_TYPE } from 'src/profit/constants'
import { ProfitSevice } from 'src/profit/profit.service'
import { SpendingBalancesSevice } from 'src/spending_balances/spending_balances.service'
import { Connection, Repository } from 'typeorm'

import { getContract } from '../common/Web3'
import { User } from '../databases/entities/user.entity'
import { UserStakeEntity } from '../databases/entities/user_stake.entity'
import { AddStakingInput } from './dtos/add-staking.dto'
import {
  DATE_NOW,
  IsLock,
  KEY_IN_CACHE,
  LOCK_TIME,
  NUMBER_DAY_IN_MONTH,
  NUMBER_DAY_IN_YEAR,
  ONE_DAY,
  PERCENT_BEFORE_LOCK_TIME,
  StatusStacking,
  TOKEN_SYMBOL,
  TX_HISTORIES_STATUS,
  TX_HISTORIES_TYPE
} from './enum'

@Injectable()
export class StackDetailsService {
  constructor(
    @InjectRepository(StackDetails)
    private stackDetailsRepository: Repository<StackDetails>,
    @InjectRepository(UserStakeEntity)
    private stakesRepository: Repository<UserStakeEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Stakes)
    private stakeRepository: Repository<Stakes>,
    private spendingBalancesService: SpendingBalancesSevice,
    private profitService: ProfitSevice,
    private readonly connection: Connection

  ) { }

  async addStaking(user: User, payload: AddStakingInput) {
    try {
      const userFind = await User.findOne({ id: user.id })
      // if (userFind.wallet.toLowerCase() != process.env.ADMIN_MAIN_WALLET.toLowerCase()) {
      //   throw new Error('Unauthorized');
      // }
      const { totalStakeAllocation } = payload
      const curentTime = new Date()
      const endTimeCampaign = new BigNumber(curentTime.getTime())
        .plus(1000 * 60 * 60 * 120)
        .toString()
      const stake = await this.insertStaking(
        '0',
        totalStakeAllocation,
        totalStakeAllocation,
        endTimeCampaign
      )
      return await stake.save()
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async insertStaking(
    tvl: string,
    availableTotalStake: string,
    totalStakeAllocation: string,
    endTimeCampaign: string
  ) {
    const checkStake = await Stakes.findOne()
    if (checkStake) {
      throw new Error('Stake already exists')
    }
    const stake = new Stakes()
    stake.tvl = tvl
    stake.availableTotalStake = availableTotalStake
    stake.totalStakeAllocation = totalStakeAllocation
    stake.endTimeCampaign = endTimeCampaign
    stake.rewardTime = (
      Math.ceil(Number(moment().format('x')) / (1000 * 60 * 60 * 4)) *
      (1000 * 60 * 60 * 4)
    ).toString()

    return stake
  }

  async stacking(amount: string, user: User) {
    if (!amount) {
      throw new BadRequestException('Invalid quantity')
    }
    if (amount == '0') {
      throw new BadRequestException('Amount input can not be zero')
    }
    await this.spendingBalancesService.minusTokenSpendingBalances(user.id, TOKEN_SYMBOL, amount)
    const stackCampaigns = await this.insertStackCampaigns()
    const stack = await this.insertStackDetails(amount, stackCampaigns, user.id)
    const stackDetails = await stack.save()
    await this.plusTotalStaking(amount)
    await this.insertTxHistory(user.id, amount, TX_HISTORIES_TYPE.STACKING)

    if (stackDetails) {
      const checkStake = await UserStakeEntity.findOne({ userId: user.id })
      const totalStake = checkStake
        ? new BigNumber(checkStake.totalStake).plus(amount).toString()
        : amount
      const userStake = checkStake ? checkStake : new UserStakeEntity()
      await this.updateStakeUser(totalStake, '0', user.id, userStake)
    }
    return { stackCampaigns, stackDetails }
  }

  async updateStakeUser(
    totalStake: string,
    totalReward: string,
    userId: number,
    userStake: UserStakeEntity
  ) {
    userStake.userId = userId
    userStake.totalStake = totalStake
    userStake.totalReward = totalReward
    const stackingSetting = await StackingSetting.findOne()
    if (stackingSetting) {
      userStake.earningToken = await getEarningToken(
        JSON.parse(stackingSetting.earningTokens),
        parseInt(totalStake)
      )
      userStake.mintingDiscount = await getMintingDiscount(
        JSON.parse(stackingSetting.mintingDiscount),
        parseInt(totalStake)
      )
      userStake.levelUpDiscount = await getLevelUpDiscount(
        JSON.parse(stackingSetting.levelUpDiscount),
        parseInt(totalStake)
      )
    }
    return await userStake.save()
  }

  async plusTotalStaking(amount: string) {
    const staking = await Stakes.findOne()

    if (!staking) {
      const stake = new Stakes()
      stake.tvl = new BigNumber(amount).toString()
      stake.availableTotalStake = process.env.TOTAL_STAKE_ALLOCATION.toString()
      stake.totalStakeAllocation = process.env.TOTAL_STAKE_ALLOCATION.toString()
      await stake.save()
    } else {
      staking.tvl = new BigNumber(staking.tvl).plus(amount).toString()
      await staking.save()
    }
  }

  async minusTotalStaking(amount: string) {
    const staking = await Stakes.findOne()
    staking.tvl = new BigNumber(staking.tvl).minus(amount).toString()
    await staking.save()
  }

  async insertStackCampaigns() {
    const stackCampaigns = new StackCampaigns()
    stackCampaigns.stakeToken = TOKEN_SYMBOL
    stackCampaigns.rewardToken = TOKEN_SYMBOL
    return await stackCampaigns.save()
  }

  async insertStackDetails(
    amount: string,
    stackCampaigns: StackCampaigns,
    userId: number
  ) {
    const millisecondsTime = new Date(stackCampaigns.createdAt).getTime()
    const stackDetails = new StackDetails()
    stackDetails.userId = userId
    stackDetails.stackCampaignId = stackCampaigns.id
    stackDetails.stakeToken = TOKEN_SYMBOL
    stackDetails.amount = amount
    stackDetails.isLock = IsLock.TRUE
    stackDetails.reward = '0'
    stackDetails.statusStacking = StatusStacking.STAKE
    stackDetails.startTime = millisecondsTime.toString()
    stackDetails.rewardTime = millisecondsTime.toString()
    stackDetails.lockTime = (millisecondsTime + LOCK_TIME).toString()
    return stackDetails
  }

  async unStacking(user: User) {
    const tokenStakes = await this.findTokenStakes(user.id)
    let totalReward = '0'
    let totalAmount = '0'
    const tokenStakesUpdate = tokenStakes.map((token) => {
      totalReward = new BigNumber(totalReward).plus(token.reward).toString()
      totalAmount = new BigNumber(totalAmount).plus(token.amount).toString()
      return {
        ...token,
        statusStacking: StatusStacking.UNSTAKE
      }
    })
    await this.minusTotalStaking(totalAmount)

    await this.stackDetailsRepository.save(tokenStakesUpdate)
    const stakeUser = await UserStakeEntity.findOne({ userId: user.id })
    await this.updateStakeUser('0', '0', user.id, stakeUser)
    let total = new BigNumber(totalAmount)
      .plus(new BigNumber(totalReward))
      .toString()
    if (tokenStakes.length == 0)
      throw new BadRequestException('You are not staking')
    if (!(await this.checkLockTime(tokenStakes))) {
      const minusAmount = new BigNumber(tokenStakes[0].amount).times(PERCENT_BEFORE_LOCK_TIME)
      total = new BigNumber(totalAmount)
        .minus(minusAmount)
        .toString()
      const queryRunner = this.connection.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      await this.profitService.processProfit(user.id, TOKEN_SYMBOL.toLowerCase(), minusAmount.toString(), PROFIT_TYPE.UN_STACKING, queryRunner.manager)
      await queryRunner.commitTransaction()
    }

    await this.insertTxHistory(user.id, total, TX_HISTORIES_TYPE.UNSTACKING)

    return await this.spendingBalancesService.plusAmoutSpending(
      total,
      TOKEN_SYMBOL,
      user.id
    )
  }

  async findTokenStakes(userId) {
    const tokenStakes = await this.stackDetailsRepository
      .createQueryBuilder('stackDetail')
      .select([
        'stackDetail.id as id',
        'stackDetail.amount as amount',
        'stackDetail.reward as reward',
        'stackDetail.lock_time as lockTime',
        'stackDetail.status_stacking as statusStacking'
      ])
      .where(
        'stackDetail.status_stacking = :status AND stackDetail.user_id = :userId AND stackDetail.stake_token = :symbol',
        { status: StatusStacking.STAKE, userId: userId, symbol: TOKEN_SYMBOL }
      )
      .orderBy('stackDetail.created_at', 'ASC')
      .getRawMany()
    return tokenStakes
  }

  async getInfo(userId: number) {
    const userStake = await UserStakeEntity.findOne({ userId })
    const stakes = await Stakes.findOne()
    const noStake = {
      totalStake: '0',
      totalReward: '0',
      earningToken: '0',
      mintingDiscount: '0',
      levelUpDiscount: '0',
      symbol: null,
      userId: userId
    }
    const listStackDetails = await this.stackDetailsRepository.find({
      where: {
        userId: userId,
        statusStacking: StatusStacking.STAKE
      },
      order: { createdAt: 'ASC' }
    })
    let isCompound = false
    if (listStackDetails.length > 0) {
      isCompound = await this.checkLockTime(listStackDetails)
    }
    const totalStake = await Stakes.findOne()
    const tvl = totalStake ? totalStake.tvl : '0'
    const stake = userStake ? userStake : noStake
    const apr = await this.getApr(stakes.totalStakeAllocation, stakes.tvl)
    const aprInDay = await this.getAprInDay(
      stakes.totalStakeAllocation,
      stakes.tvl
    )
    const slftPriceUsd = await getSlftPrice()
    return {
      stake,
      isCompound,
      tvl,
      apr,
      aprInDay,
      slftPriceUsd: slftPriceUsd.toString()
    }
  }

  async compound(userId: number) {
    const listStackDetails = await this.stackDetailsRepository.find({
      where: {
        userId: userId,
        statusStacking: StatusStacking.STAKE
      },
      order: { createdAt: 'ASC' }
    })
    if (listStackDetails.length == 0)
      throw new BadRequestException('You are not staking')

    if (await this.checkLockTime(listStackDetails)) {
      const combineStackDetail = await this.combineStackDetail(
        listStackDetails,
        userId
      )
      return await combineStackDetail.save()
    } else {
      throw new BadRequestException('You are not eligible!')
    }
  }

  async checkLockTime(listStackDetails) {
    console.log('======================================')
    console.log(listStackDetails)
    console.log(parseInt(listStackDetails[0].lockTime))
    return parseInt(listStackDetails[0].lockTime) < Number(moment().format('x'))
  }

  async combineStackDetail(listStackDetails, userId): Promise<StackDetails> {
    let total = '0'
    let totalReward = '0'
    let reward = '0'
    const combineStackDetail = listStackDetails.map((stackDetail) => {
      total = new BigNumber(total)
        .plus(stackDetail.amount)
        .plus(stackDetail.reward)
        .toString()
      totalReward = new BigNumber(totalReward)
        .plus(stackDetail.reward)
        .toString()
      reward = new BigNumber(stackDetail.reward).toString()
      return {
        ...stackDetail,
        statusStacking: StatusStacking.UNSTAKE
      }
    })
    await this.stackDetailsRepository.save(combineStackDetail)
    const StackCampaigns = await this.insertStackCampaigns()
    const stack = await this.insertStackDetails(total, StackCampaigns, userId)
    stack.lockTime = new Date(StackCampaigns.createdAt).getTime().toString()
    const stackDetails = await stack.save()
    const stakeUser = await UserStakeEntity.findOne({ userId: userId })
    await this.updateStakeUser(total, '0', userId, stakeUser)
    await this.plusTotalStaking(totalReward)
    return stackDetails
  }

  public async getApr(totalReward, totalStake) {
    if (!Number(totalStake)) return '0'
    let apr = '0'
    if (!Number(apr) || apr == 'Infinity') {
      apr = await this.calApr(totalReward, totalStake)
    }
    return apr
  }

  public async getAprInDay(totalReward, totalStake) {
    let apr = '0'
    if (!Number(apr)) {
      apr = await this.calAprInDay(totalReward, totalStake)
    }
    return apr
  }

  async calApr(totalReward, totalStake) {
    const totalRewardMonth = new BigNumber(totalStake).times(
      NUMBER_DAY_IN_MONTH
    )
    return new BigNumber(totalReward)
      .div(totalRewardMonth)
      .times(NUMBER_DAY_IN_YEAR)
      .times(100)
      .toString()
  }

  async calAprInDay(totalReward, totalStake) {
    const totalStakeInMonth = new BigNumber(totalStake)
      .times(NUMBER_DAY_IN_MONTH)
      .toString()
    if (!Number(totalStakeInMonth)) return '0'
    return new BigNumber(totalReward).div(totalStakeInMonth).toString()
  }

  async getSlftPriceFromUtils() {
    return getSlftPrice()
  }

  async insertTxHistory(usedId: number, amount: string, type: string) {
    const txHistory = new TxHistories()
    txHistory.amount = amount
    txHistory.symbol = TOKEN_SYMBOL
    txHistory.userId = usedId
    txHistory.status = TX_HISTORIES_STATUS.SUCCESS
    txHistory.type = type
    txHistory.tx = '0x0000000000000000000000000000000000000000'
    return txHistory.save()
  }
}
