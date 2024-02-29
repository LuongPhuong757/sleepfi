import BigNumber from "bignumber.js";

export enum StatusStacking {
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
}

export const ONE_DAY = new BigNumber(1000 * 60 * 60 * 4).toString()
export const TOTAL_REWARD = 1000000

export const TRANSACTION_TYPE = {
  WITHDRAW_TOKEN: 'withdraw_token',
  WITHDRAW_NFT: 'withdraw_nft',
  DEPOSIT_TOKEN: 'deposit_token',
  DEPOSIT_NFT: 'deposit_nft',
  ADMIN_WITHDRAW_TOKEN: 'admin_withdraw_token',
  REWARD_USER: 'reward_user'

}

export const CATEGORY_TYPE = {
  BED: 1,
  JEWEL: 2,
  ITEM: 3
}

export const NUMBER_DAY_IN_MONTH = 30

export const NUMBER_DAY_IN_YEAR = 365

export const KEY_IN_CACHE = {
  APR: 'apr',
  TOTAL_REWARD_DAY: 'total_reward_day',
  APR_IN_DAY: 'apr_in_day'
}

export const MAX_AMOUNT = 2

export const NFT_LEVEL_UP_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success'
}

export const PAYMENT_USER_STATUS = {
  NEW: 'new',
  SENDING: 'sending',
  SUCCESS: 'success'
}

export const SYMBOL_TOKEN = {
  SLFT: 'slft',
  AVAX: 'avax',
  SLGT: 'slgt'
}
