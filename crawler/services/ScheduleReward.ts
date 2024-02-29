import BigNumber from "bignumber.js";
import { RewardHistory } from "crawler/entities/RewardHistory.entity";
import moment from "moment";
import { LessThanOrEqual, MoreThan } from "typeorm";

import Redis from "../common/Redis";
import { KEY_IN_CACHE, NUMBER_DAY_IN_MONTH, NUMBER_DAY_IN_YEAR, ONE_DAY, StatusStacking, SYMBOL_TOKEN, TRANSACTION_TYPE } from "../constants/enum";
import { StackDetails } from "../entities/StackDetails.entity";
import { Stakes } from "../entities/Stakes.entity";
import { UserStakeEntity } from "../entities/UserStake.entity";
import { TxHistories } from "./TxHistories.entity";

export class ScheduleRewardService {

  public stackEveryDay = async () => {
    console.log('====================================');
    console.log(`ScheduleReward`);
    console.log('====================================');
    const now = new Date().getTime();
    const timeToCompare = new BigNumber(now).minus(ONE_DAY).toString()
    const stackDetailsArr = await StackDetails.find({
      where: { rewardTime: LessThanOrEqual(timeToCompare), statusStacking: StatusStacking.STAKE },
    });
    const totalAmout = stackDetailsArr.reduce((total, item) => {
      return new BigNumber(total).plus(item.amount).toString();
    }, '0');
    const stakes = await Stakes.findOne()
    if (stakes && (parseInt(stakes.endTimeCampaign) > (Number(moment().format('x'))))) {
      let rewardInDay = await Redis.getInstance().getDataFromCache(KEY_IN_CACHE.TOTAL_REWARD_DAY)
      if (!rewardInDay) {
        rewardInDay = new BigNumber(stakes.totalStakeAllocation).dividedBy(NUMBER_DAY_IN_MONTH).toString();
      }
      if (new BigNumber(rewardInDay).isGreaterThan(stakes.availableTotalStake)) return
      const reward = new BigNumber(rewardInDay).div(totalAmout).toString();
      const result = await this.updateEachReward(stackDetailsArr, reward);
      await this.insertHistoryReward(stackDetailsArr,reward)
      const stackDetailsList = await StackDetails.save(result);
      await this.updateUserStakes(stackDetailsList)

      stakes.availableTotalStake = new BigNumber(stakes.availableTotalStake).minus(rewardInDay).toString();
      await stakes.save()

      const apr = await this.calculatorApr(stakes.totalStakeAllocation, stakes.tvl)
      const aprInDay = await this.calculatorAprInDay(stakes.totalStakeAllocation, stakes.tvl)

      await this.insertRewardHistory(stakes.tvl, moment().format('x'))
      // set data to cache
      await Redis.getInstance().setDataToCache(KEY_IN_CACHE.APR, apr)
      await Redis.getInstance().setDataToCache(KEY_IN_CACHE.TOTAL_REWARD_DAY, rewardInDay)
      await Redis.getInstance().setDataToCache(KEY_IN_CACHE.APR_IN_DAY, aprInDay)

      return { stackDetailsList };
    }
    return
  };

  public updateEachReward = async (stackDetailsArr, reward) => {
    const result = stackDetailsArr.map((item) => {
      const userReward = new BigNumber(reward).times(item.amount)
      const totalReward = new BigNumber(item.reward ? item.reward : 0).plus(userReward).toString();
      return {
        ...item,
        reward: totalReward,
        rewardTime: new BigNumber(item.rewardTime).plus(ONE_DAY).toString()
      };
    });
    return result;
  };

  public insertHistoryReward = async (stackDetailsArr,reward) => {
    const insertRewardHistorys = []
    const listUserStake = await UserStakeEntity.find()
    const result = listUserStake.map((userStake) => {
      const listStakeDetail = stackDetailsArr.filter((stakeDetail) => {
        return userStake.userId == stakeDetail.userId
      })
      const totalReward = listStakeDetail.reduce((total, stackDetail) => {
        return new BigNumber(total).plus(new BigNumber(reward).times(stackDetail.amount))
      }, '0')
      const insertRewardHistory = this.insertIntoTxHistory(userStake.userId,SYMBOL_TOKEN.SLFT,totalReward.toString(),'1')
      insertRewardHistorys.push(insertRewardHistory)
    })
    await Promise.all(insertRewardHistorys)
  }

  public updateUserStakes = async (stackDetailsList) => {
    const listUserStake = await UserStakeEntity.find()
    const updateListUserStake = []
    listUserStake.map((userStake) => {
      let totalReward = new BigNumber('0')
      const listStakeDetail = stackDetailsList.filter((stakeDetail) => {
        return userStake.userId == stakeDetail.userId
      })
      totalReward = listStakeDetail.reduce((total, stackDetail) => {
        return new BigNumber(total).plus(stackDetail.reward)
      }, '0')
      if (parseInt(totalReward.toString()) != 0) {
        userStake.totalReward = totalReward.toString()
        updateListUserStake.push(userStake.save())
      }
    })
    await Promise.all(updateListUserStake)
  }

  public async calculatorApr(totalReward, totalStake) {
    const totalRewardMonth = new BigNumber(totalStake).times(NUMBER_DAY_IN_MONTH)
    return (new BigNumber(totalReward).div(totalRewardMonth)).times(NUMBER_DAY_IN_YEAR).times(100).toString()
  }

  public async calculatorAprInDay(totalReward, totalStake) {
    const totalStakeInMonth = new BigNumber(totalStake).times(NUMBER_DAY_IN_MONTH).toString()
    return new BigNumber(totalReward).div(totalStakeInMonth).toString()
  }

  public async insertRewardHistory(tvl: string, rewardTime: string) {
    const rewardHistory = new RewardHistory()
    rewardHistory.tvl = tvl;
    rewardHistory.rewardTime = rewardTime;
    return await rewardHistory.save()
  }

  async insertIntoTxHistory(userId: number,symbol: string,amount: string,tx: string) {
    try {
      const txHistory = new TxHistories()
      txHistory.userId = userId
      txHistory.symbol = symbol
      txHistory.amount = amount
      txHistory.tx = '0x'
      txHistory.type = TRANSACTION_TYPE.REWARD_USER
      return txHistory.save()
    } catch (error) {
      console.log(error)
    }
  }
}
