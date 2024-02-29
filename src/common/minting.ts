import { isArray } from 'class-validator'

import { getRandomWithPercent } from './LuckyBox'

const PERCENT_MINTING = [
  {
    parent1: 'common',
    parent2: 'common',
    common_bedbox: 100,
    uncommon_bedbox: 0,
    rare_bedbox: 0,
    epix_bedbox: 0,
    legendary_bedbox: 0
  },

  {
    parent1: 'common',
    parent2: 'uncommon',
    common_bedbox: 50,
    uncommon_bedbox: 50,
    rare_bedbox: 0,
    epix_bedbox: 0,
    legendary_bedbox: 0
  },

  {
    parent1: 'common',
    parent2: 'rare',
    common_bedbox: 50,
    uncommon_bedbox: 10,
    rare_bedbox: 40,
    epix_bedbox: 0,
    legendary_bedbox: 0
  },

  {
    parent1: 'common',
    parent2: 'epic',
    common_bedbox: 50,
    uncommon_bedbox: 5,
    rare_bedbox: 5,
    epix_bedbox: 40,
    legendary_bedbox: 0
  },

  {
    parent1: 'common',
    parent2: 'legendary',
    common_bedbox: 50,
    uncommon_bedbox: 3,
    rare_bedbox: 3,
    epix_bedbox: 4,
    legendary_bedbox: 40
  },

  {
    parent1: 'uncommon',
    parent2: 'uncommon',
    common_bedbox: 0,
    uncommon_bedbox: 100,
    rare_bedbox: 0,
    epix_bedbox: 0,
    legendary_bedbox: 0
  },

  {
    parent1: 'uncommon',
    parent2: 'rare',
    common_bedbox: 0,
    uncommon_bedbox: 50,
    rare_bedbox: 50,
    epix_bedbox: 0,
    legendary_bedbox: 0
  },

  {
    parent1: 'uncommon',
    parent2: 'epic',
    common_bedbox: 0,
    uncommon_bedbox: 45,
    rare_bedbox: 10,
    epix_bedbox: 45,
    legendary_bedbox: 0
  },

  {
    parent1: 'uncommon',
    parent2: 'legendary',
    common_bedbox: 0,
    uncommon_bedbox: 50,
    rare_bedbox: 5,
    epix_bedbox: 5,
    legendary_bedbox: 40
  },

  {
    parent1: 'rare',
    parent2: 'rare',
    common_bedbox: 0,
    uncommon_bedbox: 0,
    rare_bedbox: 100,
    epix_bedbox: 0,
    legendary_bedbox: 0
  },

  {
    parent1: 'rare',
    parent2: 'epic',
    common_bedbox: 0,
    uncommon_bedbox: 0,
    rare_bedbox: 50,
    epix_bedbox: 50,
    legendary_bedbox: 0
  },

  {
    parent1: 'rare',
    parent2: 'legendary',
    common_bedbox: 0,
    uncommon_bedbox: 0,
    rare_bedbox: 50,
    epix_bedbox: 10,
    legendary_bedbox: 40
  },

  {
    parent1: 'epic',
    parent2: 'epic',
    common_bedbox: 0.1,
    uncommon_bedbox: 0.1,
    rare_bedbox: 1,
    epix_bedbox: 98.8,
    legendary_bedbox: 0
  },

  {
    parent1: 'epic',
    parent2: 'legendary',
    common_bedbox: 0.1,
    uncommon_bedbox: 0.1,
    rare_bedbox: 0.1,
    epix_bedbox: 60,
    legendary_bedbox: 39.7
  },

  {
    parent1: 'legendary',
    parent2: 'legendary',
    common_bedbox: 0.1,
    uncommon_bedbox: 0.1,
    rare_bedbox: 1,
    epix_bedbox: 2,
    legendary_bedbox: 96.8
  }
]

const BROKEN_RATE = [
  {
    parent1: 'common',
    parent2: 'common',
    fee: 5,
    brokenRate: 10
  },
  {
    parent1: 'common',
    parent2: 'uncommon',
    fee: 10,
    brokenRate: 15
  },
  {
    parent1: 'uncommon',
    parent2: 'uncommon',
    fee: 15,
    brokenRate: 20
  }
]

const CHECK_PARENT = async (parent: string) => {
  if (parent != VALUE_QUALITY.common && parent != VALUE_QUALITY.uncommon) {
    throw new Error('Quality is not support yet.')
  }
}

export const GET_BROKEN_MINTING = async (parent1: string, parent2: string) => {
  await CHECK_PARENT(parent1)
  await CHECK_PARENT(parent2)
  const data = await ARRAY_MINT_GET_ITEM(BROKEN_RATE, parent1, parent2)
  return data ? data : null
}

const ARRAY_MINT_GET_ITEM = async (
  arr: any,
  parent1: string,
  parent2: string
) => {
  if (isArray(arr)) {
    const data = arr.find((item) => {
      if (
        (parent1 == item.parent1 && parent2 == item.parent2) ||
        (parent2 == item.parent1 && parent1 == item.parent2)
      ) {
        return item
      }
    })
    return data
  }
  return null
}

export const GET_PERCENT_MINTING = async (parent1: string, parent2: string) => {
  const data = await ARRAY_MINT_GET_ITEM(PERCENT_MINTING, parent1, parent2)
  return data ? data : null
}

export const GET_ARRAY_PERCENT_MINTING = async (
  parent1: string,
  parent2: string
) => {
  const data = await GET_PERCENT_MINTING(parent1, parent2)
  const arr = []

  arr.push(
    {
      value: 'common',
      percent: data.common_bedbox
    },
    {
      value: 'uncommon',
      percent: data.uncommon_bedbox
    },
    {
      value: 'rare',
      percent: data.rare_bedbox
    },
    {
      value: 'epix',
      percent: data.epix_bedbox
    },
    {
      value: 'legendary',
      percent: data.legendary_bedbox
    }
  )

  return arr
}

export const GET_RANDOM_MINTING = async (parent1: string, parent2: string) => {
  const arr = await GET_ARRAY_PERCENT_MINTING(parent1, parent2)
  return await getRandomWithPercent(arr)
}

const FEE_COMMON_COMMON = [
  [600, 600, 750, 1050, 1200, 1350, 1500],
  [600, 600, 750, 1200, 1350, 1500, 1650],
  [750, 750, 900, 1350, 1500, 1650, 1800],
  [1050, 1200, 1350, 1500, 1650, 1800, 1950],
  [1200, 1350, 1500, 1650, 1800, 1950, 2100],
  [1350, 1500, 1650, 1800, 1950, 2100, 2250],
  [1500, 1650, 1800, 1950, 2100, 2250, 2400]
]

const FEE_UNCOMMON_UNCOMMON = [
  [2400, 2400, 3000, 3150, 3600, 4050, 4500],
  [2400, 2400, 3000, 3600, 4050, 4500, 4950],
  [3000, 3000, 3600, 4050, 4500, 4950, 5400],
  [3150, 3600, 4050, 4500, 4950, 5400, 5850],
  [3600, 5550, 4500, 4950, 5400, 5850, 6300],
  [4050, 4500, 4950, 5400, 5850, 6300, 6750],
  [4500, 4950, 5400, 5850, 6300, 6750, 7200]
]

const FEE_COMMON_UNCOMMON = [
  [780, 780, 975, 1365, 1560, 1755, 1950],
  [780, 780, 975, 1560, 1755, 1950, 2145],
  [975, 975, 1170, 1755, 1950, 2145, 2340],
  [1365, 1560, 1755, 1950, 2145, 2340, 2535],
  [1560, 1755, 1950, 2145, 2340, 2535, 2730],
  [1755, 1950, 2145, 2340, 2535, 2730, 2925],
  [1950, 2145, 2340, 2535, 2730, 2925, 3120]
]

const VALUE_QUALITY = {
  common: 'common',
  uncommon: 'uncommon'
}

export const MAX_BED_MINT = 6
export const MIN_BED_MINT = 0

export const PERCENT_MAX = 100

const GET_FEE_TABLE = async (parent1: string, parent2: string) => {
  if (parent1 == VALUE_QUALITY.common && parent2 == VALUE_QUALITY.common) {
    return FEE_COMMON_COMMON
  } else if (
    parent1 == VALUE_QUALITY.uncommon &&
    parent2 == VALUE_QUALITY.uncommon
  ) {
    return FEE_UNCOMMON_UNCOMMON
  } else {
    return FEE_COMMON_UNCOMMON
  }
}

export const GET_FEE = async (
  bedMintParent1: number,
  bedMintParent2: number,
  parent1: string,
  parent2: string
) => {
  if (
    bedMintParent1 > MAX_BED_MINT ||
    bedMintParent2 > MAX_BED_MINT ||
    bedMintParent1 < MIN_BED_MINT ||
    bedMintParent2 < MIN_BED_MINT
  ) {
    return null
  }

  await CHECK_PARENT(parent1)
  await CHECK_PARENT(parent2)
  const feeTable = await GET_FEE_TABLE(parent1, parent2)
  return feeTable[bedMintParent1][bedMintParent2]
}

const ATTRIBUTE_POINT_COMMON = [
  { value: 2, percent: 18 },
  { value: 3, percent: 14 },
  { value: 4, percent: 44 },
  { value: 5, percent: 12 },
  { value: 6, percent: 8 },
  { value: 7, percent: 4 }
]

const ATTRIBUTE_POINT_UNCOMMON = [
  { value: 4, percent: 30 },
  { value: 5, percent: 22 },
  { value: 6, percent: 15 },
  { value: 7, percent: 10 },
  { value: 8, percent: 8 },
  { value: 9, percent: 6 },
  { value: 10, percent: 4 },
  { value: 11, percent: 3 },
  { value: 12, percent: 2 }
]

const GET_ARRAY_POINT = async (quality: string) => {
  await CHECK_PARENT(quality)
  let array = []
  switch (quality) {
    case VALUE_QUALITY.common:
      array = ATTRIBUTE_POINT_COMMON
      break
    case VALUE_QUALITY.uncommon:
      array = ATTRIBUTE_POINT_UNCOMMON
      break
    default:
      array = ATTRIBUTE_POINT_COMMON
      break
  }

  return array
}
export const GET_POINT = async (quality: string) => {
  const arr = await GET_ARRAY_POINT(quality)
  return await getRandomWithPercent(arr)
}
