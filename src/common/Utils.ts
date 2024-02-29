import { BadRequestException } from '@nestjs/common'
import BigNumber from 'bignumber.js'
import { SpendingBalances } from 'src/databases/entities/spending_balances.entity'

import { getContract } from '../common/Web3'

export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'collection',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'LogLockNft',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256'
      }
    ],
    name: 'batchMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_tokenURI',
        type: 'string'
      }
    ],
    name: 'mintTo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'LogLockToken',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      {
        internalType: 'uint112',
        name: '_reserve1',
        type: 'uint112'
      },
      { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export const TOKEN_SUPPORT = [
  {
    symbol: 'avax',
    address: process.env.AVAX_ADDRESS
  },
  {
    symbol: 'slgt',
    address: process.env.SLGT_ADDRESS
  },
  {
    symbol: 'slft',
    address: process.env.SLFT_ADDRESS
  },
  {
    symbol: 'usdc',
    address: process.env.USDC_ADDRESS
  },
  {
    symbol: 'wavax',
    address: process.env.WAVAX
  },
  {
    symbol: 'pair_avax_slft',
    address: process.env.PAIR_AVAX_SLFT
  },
  {
    symbol: 'pair_avax_usdc',
    address: process.env.PAIIR_AVAX_USDC
  },
  {
    symbol: 'factory_trader_joe',
    address: process.env.FACTORY_TRADER_JOE
  },
  {
    symbol: 'router_trader_joe',
    address: process.env.ROUTER_TRADER_JOE
  }
]

export const CONTRACT_SUPPORT = [
  {
    symbol: 'treasury',
    address: process.env.TREASURY
  },
  {
    symbol: 'multisender',
    address: process.env.MULTISENDER
  }
]

const LEVEL_UP_VALUE = [
  // 0
  {
    level: 0,
    level_time: 60,
    level_token: 2.7,
    level_fee: 7.0
  },

  // 1
  {
    level: 1,
    level_time: 120,
    level_token: 5.4,
    level_fee: 33.0
  },

  // 2
  {
    level: 2,
    level_time: 180,
    level_token: 8.0,
    level_fee: 50.0
  },

  // 3
  {
    level: 3,
    level_time: 240,
    level_token: 10.7,
    level_fee: 130.0
  },

  // 4
  {
    level: 4,
    level_time: 300,
    level_token: 13.4,
    level_fee: 160.0
  },

  // 5
  {
    level: 5,
    level_time: 360,
    level_token: 16.1,
    level_fee: 190.0
  },

  // 6
  {
    level: 6,
    level_time: 420,
    level_token: 18.8,
    level_fee: 230.0
  },

  // 7
  {
    level: 7,
    level_time: 480,
    level_token: 21.4,
    level_fee: 260.0
  },

  // 8
  {
    level: 8,
    level_time: 540,
    level_token: 24.1,
    level_fee: 300.0
  },

  // 9
  {
    level: 9,
    level_time: 600,
    level_token: 26.8,
    level_fee: 650.0
  },

  // 10
  {
    level: 10,
    level_time: 660,
    level_token: 29.5,
    level_fee: 700.0
  },

  // 11
  {
    level: 11,
    level_time: 720,
    level_token: 32.2,
    level_fee: 770.0
  },

  // 12
  {
    level: 12,
    level_time: 780,
    level_token: 34.8,
    level_fee: 840
  },

  // 13
  {
    level: 13,
    level_time: 840,
    level_token: 37.5,
    level_fee: 900.0
  },

  // 14
  {
    level: 14,
    level_time: 900,
    level_token: 40.2,
    level_fee: 970.0
  },

  // 15
  {
    level: 15,
    level_time: 960,
    level_token: 42.9,
    level_fee: 1030.0
  },

  // 16
  {
    level: 16,
    level_time: 1020,
    level_token: 45.6,
    level_fee: 1100.0
  },

  // 17
  {
    level: 17,
    level_time: 1080,
    level_token: 48.2,
    level_fee: 1160.0
  },

  // 18
  {
    level: 18,
    level_time: 1140,
    level_token: 50.9,
    level_fee: 1230.0
  },

  // 19
  {
    level: 19,
    level_time: 1200,
    level_token: 53.6,
    level_fee: 2000.0
  },

  // 20
  {
    level: 20,
    level_time: 1260,
    level_token: 56.3,
    level_fee: 1400.0
  },

  // 21
  {
    level: 21,
    level_time: 1320,
    level_token: 59.0,
    level_fee: 1440.0
  },

  // 22
  {
    level: 22,
    level_time: 1380,
    level_token: 61.6,
    level_fee: 1480.0
  },

  // 23
  {
    level: 23,
    level_time: 1440,
    level_token: 64.3,
    level_fee: 1550.0
  },

  // 24
  {
    level: 24,
    level_time: 1500,
    level_token: 67.0,
    level_fee: 1600
  },

  // 25
  {
    level: 25,
    level_time: 1560,
    level_token: 69.7,
    level_fee: 1700.0
  },

  // 26
  {
    level: 26,
    level_time: 1620,
    level_token: 72.4,
    level_fee: 1800.0
  },

  // 27
  {
    level: 27,
    level_time: 1680,
    level_token: 75.0,
    level_fee: 1900.0
  },

  // 28
  {
    level: 28,
    level_time: 1740,
    level_token: 77.0,
    level_fee: 2000.0
  },

  // 29
  {
    level: 29,
    level_time: 1800,
    level_token: 80.0,
    level_fee: 2100.0
  },

  // 30
  {
    level: 30,
    level_time: 1860,
    level_token: null,
    level_fee: null
  }
]

export const getEarningToken = async (
  EARNING_TOKEN_WITH_STAKE,
  rank: number
) => {
  if (rank == 0) return '0'
  const data = EARNING_TOKEN_WITH_STAKE.filter((item) => {
    return (
      (item.start < rank && rank <= item.end) ||
      (item.start < rank && item.end == null)
    )
  })
  return data[0].value.toString()
}

export const getMintingDiscount = async (
  MINTING_DISCOUNT_WITH_STAKE,
  rank: number
) => {
  if (rank == 0) return '0'
  const data = MINTING_DISCOUNT_WITH_STAKE.filter((item) => {
    return (
      (item.start < rank && rank <= item.end) ||
      (item.start < rank && item.end == null)
    )
  })
  return data[0].value.toString()
}

export const getLevelUpDiscount = async (
  LEVEL_UP_DISCOUNT_WITH_STAKE,
  rank: number
) => {
  if (rank == 0) return '0'
  const data = LEVEL_UP_DISCOUNT_WITH_STAKE.filter((item) => {
    return (
      (item.start < rank && rank <= item.end) ||
      (item.start < rank && item.end == null)
    )
  })
  return data[0].value.toString()
}

export const getLevel = async (level: number) => {
  // level -= 1;
  if (!LEVEL_UP_VALUE[level]) {
    throw new BadRequestException("Level doesn't exists")
  }

  return LEVEL_UP_VALUE[level]
}

// export const minusTokenSpendingBalances = async (
//   userId: number,
//   symbol: string,
//   amount: string
// ) => {
//   const spendingBalances = await SpendingBalances.findOne({
//     userId: userId,
//     symbol: symbol
//   })
//   if (!spendingBalances)
//     throw new BadRequestException('Spending Balances not found')
//   if (
//     new BigNumber(spendingBalances.availableAmount).comparedTo(amount) == -1
//   ) {
//     throw new BadRequestException('Token number is not enough')
//   } else {
//     const beforeBalance = spendingBalances.availableAmount
//     spendingBalances.amount = new BigNumber(spendingBalances.amount)
//       .minus(amount)
//       .toString()
//     spendingBalances.availableAmount = new BigNumber(
//       spendingBalances.availableAmount
//     )
//       .minus(amount)
//       .toString()
//     await spendingBalances.save()
//     return {
//       beforeBalance,
//       newBalance: spendingBalances.availableAmount
//     }
//   }
// }

const getPriceAvaxFromCoingecko = async () => {
  const Coingecko = require('coingecko-api')
  const coingeckoApi = new Coingecko()

  const data = await coingeckoApi.simple.price({
    ids: ['avalanche-2'],
    vs_currencies: 'usd'
  })
  return data.data['avalanche-2'].usd
}

const getRateSLFTvsAvax = async () => {
  const lpContract = getContract(
    abi,
    process.env.PROVIDER,
    process.env.LP_SLFT_WITH_AVAX
  )
  const reserves = await lpContract.methods.getReserves().call()
  return new BigNumber(reserves._reserve1)
    .div(new BigNumber(reserves._reserve0))
    .toString()
}

export const getSlftPrice = async () => {
  const avaxPrice = await getPriceAvaxFromCoingecko()
  const rate = await getRateSLFTvsAvax()
  if (!avaxPrice || !rate) return 0
  return new BigNumber(avaxPrice).times(rate).toNumber().toFixed(12)
}

export const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}
