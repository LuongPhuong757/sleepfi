export enum GiftPayoutStatus {
  NEW = 'NEW',
  INPRO = 'INPRO',
  DONE = 'DONE',
  FAIL = 'FAIL'
}

export enum MinimumFirstGift {
  amount = 10 // 300 USD for payout then send 1$ AVAX for User
}

export const SupportedCurrencies = [
  {
    symbol: 'VND',
    name: 'Vietnamese Dong'
  },
  {
    symbol: 'USD',
    name: 'United States Dollar'
  },
  {
    symbol: 'EUR',
    name: 'Euro'
  },
  {
    symbol: 'GBP',
    name: 'British Pound Sterling'
  },
  {
    symbol: 'JPY',
    name: 'Japanese Yen'
  }
]
