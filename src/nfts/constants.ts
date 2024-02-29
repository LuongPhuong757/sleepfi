export const NFT_TYPE = {
  BEDS: 'bed',
  BED_BOX: 'bedbox',
  GENESIS_BEDS: 'genesis_beds',
  JEWEL: 'jewel'
}

export const CLASS = {
  SHORT: 'short',
  MIDDLE: 'middle',
  LONG: 'long',
  FLEXIBLE: 'flexible'
}

export const BED_QUALITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
}

export const INSURANCE_COST_PERCENT = {
  common: 3,
  uncommon: 4,
  rare: 5,
  epic: 6,
  legendary: 7
}

export const JEWEL_TYPE = {
  Ruby: 'ruby',
  Sapphire: 'sapphire',
  Emeraid: 'emeraid',
  Diamond: 'diamond',
  Amethyst: 'amethyst'
}

export const ITEM_TYPE = {
  BLUE: 'Blue',
  GREEN: 'Green',
  RED: 'Red',
  PURPLE: 'Purple'
}

export const SORT_PRICE = {
  LOW_PRICE: 'LowPrice',
  HIGH_PRICE: 'HighPrice',
  LATEST: 'Latest'
}

export const CATEGORY_TYPE = {
  BED: 1,
  JEWEL: 2,
  ITEM: 3
}

export enum LOCK_STATUS_NFT {
  LOCK = 1,
  UNLOCK = 0
}

export const NUMBER_VALUE = {
  DURABILITY: 100,
  LEVEL: 30
}
export const SYMBOL_SALE = 'AVAX'

export const TOKEN_FOR_UPGRADE_JEWEL = [
  { level: 1, slft: 100, percent: 35 },
  { level: 2, slft: 200, percent: 55 },
  { level: 3, slft: 400, percent: 65 },
  // { level: 3, slft: 400, percent: 100 },
  // { level: 4, slft: 800, percent: 75 },
  // { level: 4, slft: 800, percent: 100 },
  { level: 4, slft: 800, percent: 75 }
  // { level: 5, slft: 1, slgt: 1, percent: 100 },
]

export const TOKEN_FOR_UPGRADE_ITEM = [
  { level: 1, slft: 50, percent: 35 },
  { level: 2, slft: 100, percent: 55 },
  { level: 3, slft: 200, percent: 65 },
  // { level: 3, slft: 200, percent: 100 },
  { level: 4, slft: 400, percent: 75 }
  // { level: 4, slft: 400, percent: 100 },
  // { level: 5, slft: 1, slgt: 1, percent: 100 },
]

export enum IS_BURN {
  FALSE = 0,
  TRUE = 1
}

export enum NFT_TYPE_OF_CATEGORY {
  BED = 'bed',
  BEDBOX = 'bedbox',
  JEWELS = 'jewel',
  ITEMS = 'item'
}

const PER_WITH_LEVEL = [
  //lv0
  {
    level: 0,
    common: 0.804,
    uncommon: 1.206
  },

  //lv1
  {
    level: 1,
    common: 0.8308,
    uncommon: 1.2462
  },
  //lv2
  {
    level: 2,
    common: 0.8576,
    uncommon: 1.2864
  },
  //lv3
  {
    level: 3,
    common: 0.8844,
    uncommon: 1.3266
  },
  //lv4
  {
    level: 4,
    common: 0.9112,
    uncommon: 1.3668
  },
  //lv5
  {
    level: 5,
    common: 0.9648,
    uncommon: 1.4472
  },
  //lv6
  {
    level: 6,
    common: 0.9916,
    uncommon: 1.4874
  },
  //lv7
  {
    level: 7,
    common: 1.0184,
    uncommon: 1.5276
  },
  //lv8
  {
    level: 8,
    common: 1.0452,
    uncommon: 1.5678
  },
  //lv9
  {
    level: 9,
    common: 1.072,
    uncommon: 1.608
  },
  //lv10
  {
    level: 10,
    common: 1.1524,
    uncommon: 1.7286
  },
  //lv11
  {
    level: 11,
    common: 1.1792,
    uncommon: 1.7688
  },
  //lv12
  {
    level: 12,
    common: 1.2328,
    uncommon: 1.8492
  },
  //lv13
  {
    level: 13,
    common: 1.2864,
    uncommon: 1.9296
  },
  //lv14
  {
    level: 14,
    common: 1.34,
    uncommon: 2.01
  },
  //lv15
  {
    level: 15,
    common: 1.3936,
    uncommon: 2.0904
  },
  //lv16
  {
    level: 16,
    common: 1.4472,
    uncommon: 2.1708
  },
  //lv17
  {
    level: 17,
    common: 1.5008,
    uncommon: 2.2512
  },
  //lv18
  {
    level: 18,
    common: 1.5544,
    uncommon: 2.3316
  },
  //lv19
  {
    level: 19,
    common: 1.6616,
    uncommon: 2.4924
  },
  //lv20
  {
    level: 20,
    common: 1.7688,
    uncommon: 2.6532
  },
  //lv21
  {
    level: 21,
    common: 1.8492,
    uncommon: 2.7738
  },
  //lv22
  {
    level: 22,
    common: 1.9296,
    uncommon: 2.8944
  },
  //lv23
  {
    level: 23,
    common: 2.01,
    uncommon: 3.015
  },
  //lv24
  {
    level: 24,
    common: 2.0904,
    uncommon: 3.1356
  },
  //lv25
  {
    level: 25,
    common: 2.1708,
    uncommon: 3.2562
  },
  //lv26
  {
    level: 26,
    common: 2.2512,
    uncommon: 3.3768
  },
  //lv27
  {
    level: 27,
    common: 2.3316,
    uncommon: 3.4974
  },
  //lv28
  {
    level: 28,
    common: 2.412,
    uncommon: 3.618
  },
  //lv29
  {
    level: 29,
    common: 2.5,
    uncommon: 3.75
  },
  //lv30
  {
    level: 30,
    common: 2.6,
    uncommon: 3.9
  }
]

const getListFeeRepair = async (quality: string) => {
  const arr = PER_WITH_LEVEL.map((item) => {
    const level = {
      level: item.level
    }
    let fee
    switch (quality) {
      case BED_QUALITY.COMMON:
        fee = {
          fee: item.common
        }
        break
      case BED_QUALITY.UNCOMMON:
        fee = {
          fee: item.uncommon
        }
        break
    }

    return { ...level, ...fee }
  })

  return arr
}

export const getFeeRepair = async (quality: string, level: number) => {
  const arr = await getListFeeRepair(quality)
  if (!arr[level]) throw new Error("Level doesn't exists")
  return arr[level]
}
export const NFT_TYPE_ATTRIBUTES = {
  BEDS: 'bed',
  BONUS: 'bonus',
  EFFECIENCY: 'effeciency',
  LUCK: 'luck',
  RESILLIENCE: 'resillience',
  SPECIAL: 'spcial'
}

export const NFT_LEVEL_UP_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success'
}

export type NftResponseType = {
  beforeBalance: string
  currentBalance: string
}

export const ONE_HOURS = 1000 * 60 * 60
