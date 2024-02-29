export const ITEM_DATA = [
  {
    level: 1,
    percentEffect: 25,
    costToNextLvSLFT: 50,
    costToNextLvSLGT: 0,
    successRatePercent: 35
  },
  {
    level: 2,
    percentEffect: 50,
    costToNextLvSLFT: 100,
    costToNextLvSLGT: 0,
    successRatePercent: 55
  },
  {
    level: 3,
    percentEffect: 100,
    costToNextLvSLFT: 200,
    costToNextLvSLGT: 0,
    successRatePercent: 65
  },
  {
    level: 4,
    percentEffect: 150,
    costToNextLvSLFT: 400,
    costToNextLvSLGT: 100,
    successRatePercent: 75
  },
  { level: 5, percentEffect: 200 }
]

export const JEWELS_DATA = [
  {
    level: 1,
    percentEffect: 2.5,
    costToNextLvSLFT: 100,
    costToNextLvSLGT: 0,
    successRatePercent: 35
  },
  {
    level: 2,
    percentEffect: 5,
    costToNextLvSLFT: 200,
    costToNextLvSLGT: 0,
    successRatePercent: 55
  },
  {
    level: 3,
    percentEffect: 10,
    costToNextLvSLFT: 400,
    costToNextLvSLGT: 0,
    successRatePercent: 65
  },
  {
    level: 4,
    percentEffect: 15,
    costToNextLvSLFT: 800,
    costToNextLvSLGT: 200,
    successRatePercent: 75
  },
  { level: 5, percentEffect: 20, costToNextLvSLFT: 1600, costToNextLvSLGT: 400 }
]

export const getPercentItemLevel = (level: number): number => {
  return ITEM_DATA.find((e) => e.level === level)?.percentEffect || 0
}

export const getPercentJewelLevel = (level: number): number => {
  return JEWELS_DATA.find((e) => e.level === level)?.percentEffect || 0
}
