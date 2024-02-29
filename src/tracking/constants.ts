import { BED_QUALITY } from '../nfts/constants'

export enum BED_TYPE {
  SHORT = 'Short',
  MIDDLE = 'Middle',
  LONG = 'Long',
  FLEXIBLE = 'Flexible'
}

export enum STATUS_TRACKING {
  SLEEPING = 'sleeping',
  WOKE_UP = 'woke_up',
  CANCEL = 'cancel'
}

export type TOTAL_BED_STATS = {
  efficiency: string
  luck: string
  bonus: string
  special: string
  resilience: string
}

export const POSITIVE_EFFECT_DATA = [
  { bedAmount: 30, percent: 1000 },
  { bedAmount: 15, percent: 600 },
  { bedAmount: 9, percent: 450 },
  { bedAmount: 3, percent: 200 },
  { bedAmount: 1, percent: 100 }
]

export enum HEATH_APP_TYPE_DATA {
  SLEEP_IN_BED = 'sleep_in_bed',
  SLEEP_ASLEEP = 'sleep_asleep',
  SLEEP_AWAKE = 'sleep_awake',
  SLEEP_DEEP = 'sleep_deep',
  SLEEP_LIGHT = 'sleep_awake'
}

export enum TIME_ON_SLEEP_TIME_RANGE {
  WITH_15_MIN = 15,
  WITH_30_MIN = 30,
  WITH_60_MIN = 60
}

export enum TIME_ON_SLEEP_SCORE {
  WITH_15_MIN = 25,
  WITH_30_MIN = 20,
  WITH_60_MIN = 10
}

export enum BED_TIME_COMPARE_AVERAGE {
  BEFORE_AND_AFTER_60 = 60,
  BEFORE_AND_AFTER_90 = 90,
  BEFORE_AND_AFTER_120 = 120,
  BEFORE_AND_AFTER_150 = 150
}

export enum BED_TIME_COMPARE_AVERAGE_SCORE {
  BEFORE_AND_AFTER_60 = 25,
  BEFORE_AND_AFTER_90 = 20,
  BEFORE_AND_AFTER_120 = 15,
  BEFORE_AND_AFTER_150 = 10,
  DEFAULT = 20
}

export enum WOKE_UP_AFTER_ALARM {
  WITH_15_MIN = 15
}

export enum WOKE_UP_AFTER_ALARM_SCORE {
  WITH_15_MIN = 25
}

export enum WOKE_UP_BEFORE_ALARM {
  WITH_FROM_0_MIN_TO_10 = 10,
  WITH_FROM_10_MIN_TO_20 = 20,
  WITH_FROM_20_MIN_TO_30 = 30,
  WITH_FROM_30_MIN_TO_60 = 60,
  WITH_FROM_60_MIN_TO_120 = 120,
  WITH_FROM_120_MIN_TO_MORE = 120
}

export enum WOKE_UP_BEFORE_ALARM_SCORE {
  WITH_FROM_0_MIN_TO_10 = 25,
  WITH_FROM_10_MIN_TO_20 = 20,
  WITH_FROM_20_MIN_TO_30 = 15,
  WITH_FROM_30_MIN_TO_60 = 10,
  WITH_FROM_60_MIN_TO_120 = 5,
  WITH_FROM_120_MIN_TO_MORE = 0
}

export type ESTIMATE_TRACKING_RESPONSE = {
  // bedAmount: number,
  // totalStats: TOTAL_BED_STATS,
  // slftTokenAmount: string,
  // stakingAmountTimes: string,
  // insuranceTimes: string,
  // positiveEffect: string,
  // estimateSlftEarn: string,
  // durabilityReduce: string,
  // sleepScore: number,
  todayEarn: number
  maxEarnPerDay: number
}

export const LUCKY_BOX_DATA = {
  level1: {
    openingBasicCost: '13.4',
    waitingTimeMinutes: 2880,
    speedUpCost: '0.0047',
    redrawRate: '0.025'
  },
  level2: {
    openingBasicCost: '18.8',
    waitingTimeMinutes: 4320,
    speedUpCost: '0.0044',
    redrawRate: '0.05'
  }
}

export const PERCENT_LOSE_BED = [
  { type: BED_QUALITY.COMMON, percent: 5 },
  { type: BED_QUALITY.UNCOMMON, percent: 4 },
  { type: BED_QUALITY.RARE, percent: 3 },
  { type: BED_QUALITY.EPIC, percent: 2 },
  { type: BED_QUALITY.LEGENDARY, percent: 1 }
]

export const PERCENT_LOSE_JEWEL = [
  { level: 1, percent: 5 },
  { level: 2, percent: 4 },
  { level: 3, percent: 3 },
  { level: 4, percent: 2 },
  { level: 5, percent: 1 }
]

export const BED_TYPE_TIME = {
  SHORT: {
    Min: 3,
    Max: 5
  },
  MIDDLE: {
    Min: 4.5,
    Max: 7
  },
  LONG: {
    Min: 6.5,
    Max: 9
  },
  FLEXIBLE: {
    Min: 3,
    Max: 12
  }
}

export const BED_TYPE_TIME_SCORE = {
  SHORT: {
    Min: 15,
    Max: 25
  },
  MIDDLE: {
    Min: 15,
    Max: 25
  },
  LONG: {
    Min: 15,
    Max: 25
  },
  FLEXIBLE: {
    Min: 15,
    Max: 25
  }
}

export const TRACKING_AMOUNT_BONUS_PERCENT = [
  { min: 20000, max: 0, bonusPercent: 12 },
  { min: 10000, max: 20000, bonusPercent: 8 },
  { min: 5000, max: 10000, bonusPercent: 6 },
  { min: 2500, max: 5000, bonusPercent: 4 },
  { min: 0, max: 2500, bonusPercent: 2 }
]

export const DURABILITY_INCREASE_BY_BED_AMOUNT = [
  { min: 15, max: 30, times: 10 },
  { min: 10, max: 14, times: 6 },
  { min: 4, max: 9, times: 4.5 },
  { min: 2, max: 3, times: 2 }
]

export enum MESSAGE_TRACKING {
  TRACKING_ALREADY_OPEN = 'tracking.tracking_already_open',
  TRACKING_START_SUCCESS = 'tracking.start_tracking_successfully',
  INVALID_BED = 'invalid_bed',
  BED_LOCKED = 'bed_is_locked',
  INVALID_ITEM = 'invalid_item',
  ITEM_LOCKED = 'item_is_locked',
  INSUFFICIENT_DURABILITY = 'insufficient_durability',
  TRACKING_IS_NOT_OPEN = 'tracking_is_not_opening'
}

export enum PLATFORM_TYPE {
  IOS = 'IOS',
  ANDROID = 'ANDROID'
}

export type HealAppData = {
  sleepOnsetTime: string
  sleepDurationTime: string
  wokeUpTime: string
  bedTime: string
  nAwk: number
  startSleepTime: string
  timeInBed: string
}
