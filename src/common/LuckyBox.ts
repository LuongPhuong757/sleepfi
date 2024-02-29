export const LUCKY_BOX_LEVEL = [
  {
    luck_start: 0,
    luck_end: 5,
    nothing: 100,
    lv1: 0,
    lv2: 0
  },
  {
    luck_start: 5,
    luck_end: 10,
    nothing: 86,
    lv1: 14,
    lv2: 0
  },
  {
    luck_start: 10,
    luck_end: 15,
    nothing: 13,
    lv1: 77,
    lv2: 10
  },
  {
    luck_start: 15,
    luck_end: 20,
    nothing: 9,
    lv1: 82,
    lv2: 9
  },
  {
    luck_start: 20,
    luck_end: 25,
    nothing: 7,
    lv1: 81,
    lv2: 12
  },
  {
    luck_start: 25,
    luck_end: 30,
    nothing: 6,
    lv1: 88,
    lv2: 6
  },
  {
    luck_start: 30,
    luck_end: 40,
    nothing: 6,
    lv1: 47,
    lv2: 47
  },
  {
    luck_start: 40,
    luck_end: null,
    nothing: 8,
    lv1: 17,
    lv2: 75
  }
]

export const getRandomWithPercent = async (arr) => {
  const n = arr.length
  const prob_value = []
  const prob_find = []
  arr.map((e, i) => {
    if (i == 0) {
      prob_value[0] = e.value
      prob_find[0] = e.percent
      return
    }
    prob_value[i] = e.value
    prob_find[i] = prob_find[i - 1] + e.percent
  })
  const r = Math.random() * 100
  let start = 0
  let end = n - 1
  while (end > start) {
    const mid = Math.floor((start + end) / 2)
    if (prob_find[mid] == r) return prob_value[mid]
    if (prob_find[mid] > r) end = mid
    else start = mid + 1
  }
  return prob_value[end]
}

export const getRangeLuck = async (luck: number) => {
  return LUCKY_BOX_LEVEL.filter((item) => {
    if (luck == 0) return null
    return (
      (item.luck_start < luck && luck <= item.luck_end) ||
      (item.luck_start < luck && item.luck_end == null)
    )
  })
}

export const getLuckyBoxLevel = async (luck: number) => {
  const arr = []
  const listLuckyBox = await getRangeLuck(luck)
  if (!listLuckyBox.length) return null
  Object.entries(listLuckyBox[0]).map(([key, value]) => {
    if (key !== 'luck_start' && key !== 'luck_end') {
      arr.push({
        value: key,
        percent: value
      })
    }
  })
  return await getRandomWithPercent(arr)
}

export const PERCENT_QUALITY = [
  { value: 'common', percent: 98 },
  { value: 'uncommon', percent: 2 },
  { value: 'common', percent: 25 },
  { value: 'uncommon', percent: 75 }
]

export const PERCENT_CLASS = [
  { value: 'short_bed', percent: 80 },
  { value: 'middle_bed', percent: 9 },
  { value: 'long_bed', percent: 9 },
  { value: 'flexible_bed', percent: 2 },
  { value: 'short_bed', percent: 45 },
  { value: 'middle_bed', percent: 45 },
  { value: 'long_bed', percent: 8 },
  { value: 'middle_bed', percent: 8 },
  { value: 'long_bed', percent: 45 },
  { value: 'short_bed', percent: 75 },
  { value: 'middle_bed', percent: 5 },
  { value: 'long_bed', percent: 5 },
  { value: 'flexible_bed', percent: 15 },
  { value: 'short_bed', percent: 9 },
  { value: 'middle_bed', percent: 80 },
  { value: 'short_bed', percent: 10 },
  { value: 'middle_bed', percent: 44 },
  { value: 'long_bed', percent: 44 },
  { value: 'short_bed', percent: 5 },
  { value: 'middle_bed', percent: 75 },
  { value: 'long_bed', percent: 75 },
  { value: 'short_bed', percent: 25 },
  { value: 'middle_bed', percent: 25 },
  { value: 'long_bed', percent: 25 },
  { value: 'flexible_bed', percent: 25 }
]

export const getRandomImage = (level: number) => {
  // const numberImg = Math.floor(Math.random() * 5) + 1;
  return `${level}.png`
}
