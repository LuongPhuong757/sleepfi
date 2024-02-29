import { BED_TYPE_TIME } from '../constants'

export const AVERAGE_START_TIME_RANGE_SCORE = [
  {
    minutesRange: 15,
    score: 25
  },
  {
    minutesRange: 30,
    score: 24
  },
  {
    minutesRange: 45,
    score: 23
  },
  {
    minutesRange: 60,
    score: 22
  },
  {
    minutesRange: 75,
    score: 21
  },
  {
    minutesRange: 90,
    score: 20
  },
  {
    minutesRange: 105,
    score: 19
  },
  {
    minutesRange: 120,
    score: 18
  }
]

export const OUTRANGE_SCORE_AVERAGE = 17

export const AVERAGE_WAKEUP_TIME_RANGE_SCORE = [
  {
    minutesRange: 15,
    score: 25
  },
  {
    minutesRange: 30,
    score: 24
  },
  {
    minutesRange: 45,
    score: 23
  },
  {
    minutesRange: 60,
    score: 22
  },
  {
    minutesRange: 75,
    score: 21
  },
  {
    minutesRange: 90,
    score: 20
  },
  {
    minutesRange: 105,
    score: 19
  },
  {
    minutesRange: 120,
    score: 18
  }
]
export const AVERAGE_WAKEUP_TIME_DEFAULT_SCORE = 17

export const AFTER_ALARM_SCORE_SETUP = [
  {
    minutesRange: 2,
    score: 25
  },
  {
    minutesRange: 6,
    score: 23
  },
  {
    minutesRange: 10,
    score: 22
  },
  {
    minutesRange: 16,
    score: 21
  },
  {
    minutesRange: 20,
    score: 20
  },
  {
    minutesRange: 24,
    score: 19
  },
  {
    minutesRange: 30,
    score: 18
  }
]
export const OUTRANGE_WAKEUP_AFTER_ALARM_SCORE = 17

export const WAKEUP_BEFORE_ALARM_SCORE_SETUP = [
  {
    minutesRange: 15,
    score: 25
  },
  {
    minutesRange: 30,
    score: 24
  },
  {
    minutesRange: 45,
    score: 23
  },
  {
    minutesRange: 60,
    score: 22
  },
  {
    minutesRange: 75,
    score: 21
  },
  {
    minutesRange: 90,
    score: 20
  }
]

export const OUTRANGE_WAKEUP_BEFORE_ALARM_SCORE = 17

export const SLEEP_DURATION_SCORE = {
  SHORT: [
    {
      min: BED_TYPE_TIME.SHORT.Min,
      max: BED_TYPE_TIME.SHORT.Max,
      score: 25
    },
    {
      min: 2.75,
      max: 5.25,
      score: 20
    }
  ],
  MIDDLE: [
    {
      min: BED_TYPE_TIME.MIDDLE.Min,
      max: BED_TYPE_TIME.MIDDLE.Max,
      score: 25
    },
    {
      min: 4.25,
      max: 7.25,
      score: 20
    }
  ],
  LONG: [
    {
      min: BED_TYPE_TIME.LONG.Min,
      max: BED_TYPE_TIME.LONG.Max,
      score: 25
    },
    {
      min: 6.25,
      max: 9.25,
      score: 20
    }
  ],
  FLEXIBLE: [
    {
      min: BED_TYPE_TIME.FLEXIBLE.Min,
      max: BED_TYPE_TIME.FLEXIBLE.Max,
      score: 25
    },
    {
      min: 2.75,
      max: 12.25,
      score: 20
    }
  ]
}

export const OUTRANGE_SLEEP_DURATION_SCORE = 10

export const SLEEP_SCORE_MAP_TO_MULTIPLIER = [
  { min: 0, max: 9, multiplier: 0.11 },
  { min: 10, max: 19, multiplier: 0.22 },
  { min: 20, max: 29, multiplier: 0.33 },
  { min: 30, max: 39, multiplier: 0.44 },
  { min: 40, max: 49, multiplier: 0.55 },
  { min: 50, max: 59, multiplier: 0.65 },
  { min: 60, max: 69, multiplier: 0.75 },
  { min: 70, max: 72, multiplier: 0.82 },
  { min: 73, max: 76, multiplier: 0.84 },
  { min: 77, max: 79, multiplier: 0.86 },
  { min: 80, max: 82, multiplier: 0.88 },
  { min: 83, max: 86, multiplier: 0.91 },
  { min: 87, max: 89, multiplier: 0.93 },
  { min: 90, max: 92, multiplier: 0.95 },
  { min: 93, max: 95, multiplier: 0.97 },
  { min: 96, max: 98, multiplier: 0.98 },
  { min: 99, max: 100, multiplier: 1 }
]
