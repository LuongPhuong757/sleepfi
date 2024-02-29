export const WITHDRAW_TYPE = {
  TOKEN: 'token',
  NFT: 'nft'
}

export const WITHDRAW_STATUS = {
  PENDING: 'pending',
  UPDATING: 'updating',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const TX_WITHDRAW_STATUS = {
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const TRANSACTION_TYPE = {
  WITHDRAW_TOKEN: 'withdraw_token',
  WITHDRAW_NFT: 'withdraw_nft',
  DEPOSIT_TOKEN: 'deposit_token',
  DEPOSIT_NFT: 'deposit_nft'
}

export const STATUS_GET_WITHDRAW = {
  PENDING: 'pending',
  HISTORY: 'history'
}

export const TYPE_GET_WITHDRAW = {
  NFT: 'nft',
  TOKEN: 'token'
}

export const TYPE_GET_GAS = {
  NFT: 'nft',
  TOKEN: 'token'
}

export const DEFAULT_TOKEN_ID = '555'

export const DEFAULT_AMOUNT_WITHDRAW = '1'

export const LOG_WITHDRAW_EVENTS = {
  TOKEN: 'LogMultiSendToken',
  NFT: 'LogMultiSendNfts'
}
