import moment from 'moment'

export enum IsLock {
  FALSE,
  TRUE
}

export enum StatusStacking {
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE'
}

export const ONE_DAY = 1000 * 60 * 60 * 4
export const TOTAL_REWARD = 1000000
//LOCK_TIME = 1000 * 60 * 60 * 24 * 14
export const LOCK_TIME = 1000 * 60 * 60 * 56

export const TOKEN_SYMBOL = 'SLFT'

export const DATE_NOW = Number(moment().format('x'))

//export const STAKING_REWARD_TIME = moment().add(1, 'day').set({'hour': 7, 'minute': 0, 'second': 0}).format('x')
export const STAKING_REWARD_TIME = (
  Math.ceil(Number(moment().format('x')) / (1000 * 60 * 5)) *
  (1000 * 60 * 5)
).toString()
export const STAKING_END_TIME = moment().add(30, 'day').format('x')

export const PERCENT_BEFORE_LOCK_TIME = 0.02

export const NUMBER_DAY_IN_YEAR = 365
export const NUMBER_DAY_IN_MONTH = 30

export const KEY_IN_CACHE = {
  APR: 'apr',
  TOTAL_REWARD_DAY: 'total_reward_day',
  APR_IN_DAY: 'apr_in_day'
}

export const COMPOUND = {
  TRUE: 1,
  FALSE: 0
}

export const TX_HISTORIES_TYPE = {
  STACKING: 'stacking',
  UNSTACKING: 'unstacking'
}

export const TX_HISTORIES_STATUS = {
  SUCCESS: 'success'
}
