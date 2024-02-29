export type ResTrackingByBedType = {
  usedUsers: number
  bedType: string
}

export type ResGetAddPointTimes = {
  special?: number
  efficiency?: number
  luck?: number
  bonus?: number
  resilience?: number
}

export enum SettingGachaProb {
  PRO_NORMAL_TEST_NET = 'PRO_NORMAL_TEST_NET',
  PRO_SPECIAL_TEST_NET = 'PRO_SPECIAL_TEST_NET',
  PRO_NORMAL_MAIN_NET = 'PRO_NORMAL_MAIN_NET',
  PRO_SPECIAL_MAIN_NET = 'PRO_SPECIAL_MAIN_NET',
  NORMAL_GACHA_MAIN_NET = 'NORMAL_GACHA_MAIN_NET',
  SPECIAL_GACHA_MAIN_NET = 'SPECIAL_GACHA_MAIN_NET',
  NORMAL_GACHA_TEST_NET = 'NORMAL_GACHA_TEST_NET',
  SPECIAL_GACHA_TEST_NET = 'SPECIAL_GACHA_TEST_NET'
}

export enum GachaValueTypeEnum {
  BED = 'bed',
  JEWEL = 'jewel',
  ITEM = 'item',
  SLFT = 'slft'
}

export enum BED_QUALITY_ENUM {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}
