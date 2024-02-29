export enum ACTION_TARGET_TYPE {
  TOKEN = 'token',
  BED = 'bed',
  BED_BOX = 'bedbox',
  JEWEL = 'jewel',
  ITEM = 'item',
  LUCKY_BOX = 'luckybox'
}

export enum KPI_TYPE {
  STAKING_DEPOSIT = 'staking_deposit',
  STAKING_WITHDRAW = 'staking_withdraw',
  WALLET_WITHDRAW = 'wallet_draw',
  WALLET_DEPOSIT = 'wallet_deposit'
}

export enum ACTION_TYPE {
  WITHDRAW_TOKEN = 'withdraw_token',
  WITHDRAW_NFT = 'withdraw_nft',
  DEPOSIT_TOKEN = 'deposit_token',
  DEPOSIT_NFT = 'deposit_nft',
  TRADE = 'trade',
  SELL = 'sell',
  BUY = 'buy',
  MINT = 'mint',
  REPAIR = 'repair',
  LEVEL_UP = 'level_up',
  RECYCLING = 'recycling',
  OPEN_LUCK_BOX = 'open_lucky_box',
  UPGRADE = 'upgrade',
  OPEN_SOCKET = 'open_socket',
  REMOVE_JEWEL = 'remove_socket',
  NORMAL_GACHA_SINGLE = 'normal_gacha_single',
  NORMAL_GACHA_MULTIPLE = 'normal_gacha_multiple',
  SPECIAL_GACHA_SINGLE = 'special_gacha_single',
  SPECIAL_GACHA_MULTIPLE = 'special_gacha_multiple',
  ADD_POINT = 'add_point',
  SLEEP_TRACKING = 'sleep_tracking',
}

export interface ACTION_INSERT_TYPE_DTO {
  type: ACTION_TYPE | string
  targetType: ACTION_TARGET_TYPE | string
  userId: number
  symbol: string
  amount: string
  currentBalance?: string
  beforeBalance?: string
  tx?: string
  tokenId?: string
  contractAddress?: string
  tokenAddress?: string
  nftId?: number
  luckyBoxId?: number
  nftSaleId?: number
  insurance?: string
  metaData?: any
}
