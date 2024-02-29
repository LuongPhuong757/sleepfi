import BigNumber from 'bignumber.js'

export const calculateChangeBetweenNumber = (
  calculateNumber: BigNumber,
  min: BigNumber,
  max: BigNumber,
  range = 10
): string => {
  let remainderNumber = calculateNumber.toString().split('.')[1]
  if (calculateNumber.eq(min) || !remainderNumber || max.isNaN()) {
    return min.toFixed()
  }
  if (remainderNumber.length >= 2) {
    remainderNumber =
      remainderNumber.slice(0, 1) +
      '.' +
      remainderNumber.slice(1, remainderNumber.length)
  }
  const remainConvertPer1 = new BigNumber(max).minus(min).div(range)
  return min.plus(remainConvertPer1.times(remainderNumber)).toFixed()
}

export const randomBetWeen = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const isInPercent = (
  percent: number,
  min: number,
  max: number
): boolean => {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber <= percent
}

export const calculateChangeNumber = (
  calculateNumber: number,
  minNumber: number,
  maxNumber: number,
  minPercent: number,
  maxPercent: number
) => {
  if (!minNumber) {
    return 0
  }
  const diff = calculateNumber - minNumber
  if (diff === 0 || !maxNumber) {
    return minPercent
  }
  const changePercent = maxPercent - minPercent
  const changeNumber = maxNumber - minNumber
  const percentPerOne = changePercent / changeNumber
  return minPercent + diff * percentPerOne
}
