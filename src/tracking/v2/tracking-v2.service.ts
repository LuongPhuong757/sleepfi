import { Injectable } from '@nestjs/common'
import moment, { Moment } from 'moment'

import { Tracking } from '../../databases/entities/tracking.entity'
import { TrackingResult } from '../../databases/entities/tracking-result.entity'
import { randomBetWeen } from '../utils'
import {
  AFTER_ALARM_SCORE_SETUP,
  AVERAGE_START_TIME_RANGE_SCORE,
  AVERAGE_WAKEUP_TIME_DEFAULT_SCORE,
  AVERAGE_WAKEUP_TIME_RANGE_SCORE,
  OUTRANGE_SCORE_AVERAGE,
  OUTRANGE_SLEEP_DURATION_SCORE,
  OUTRANGE_WAKEUP_AFTER_ALARM_SCORE,
  OUTRANGE_WAKEUP_BEFORE_ALARM_SCORE,
  SLEEP_DURATION_SCORE,
  WAKEUP_BEFORE_ALARM_SCORE_SETUP
} from './constants'

@Injectable()
export class TrackingV2Service {
  getSleepScoreV2(
    tracking: Tracking,
    wakeUpTime: Moment,
    last7TrackingResult: TrackingResult[]
  ): number {
    const startTime = moment.unix(Number(tracking.startSleep))
    const tAlarmRing = moment.unix(Number(tracking.wakeUp))
    const MINIMUM_RECORD_TO_CHECK_AVERAGE = 7
    let avgStartTimeScore = 0
    let avgWakeUpTimeScore = 0
    let wakeUpTimeScore = 0
    let sleepDurationScore = 0
    const sleepDuration = wakeUpTime.diff(startTime, 'hours', true)
    const MIN_DURATION_SLEEP_TRACKING = 1;
    if(sleepDuration < MIN_DURATION_SLEEP_TRACKING) {
      return randomBetWeen(1, 10)
    }

    const getAverageScoreByLastResult = () => {
      if (last7TrackingResult.length < MINIMUM_RECORD_TO_CHECK_AVERAGE) {
        avgStartTimeScore = randomBetWeen(19, 25)
        avgWakeUpTimeScore = randomBetWeen(19, 25)
      } else {
        const avgStartTime = Math.round(
          last7TrackingResult.reduce(
            (prev, next) => prev + next.startSleepTime,
            0
          ) / MINIMUM_RECORD_TO_CHECK_AVERAGE
        )
        const mAvgStartTime = moment.unix(avgStartTime)
        const diffStartTime = Math.abs(
          this.diffTimeInMinutes(startTime, mAvgStartTime)
        )
        avgStartTimeScore =
          AVERAGE_START_TIME_RANGE_SCORE.find(
            (e) => e.minutesRange >= diffStartTime
          )?.score || OUTRANGE_SCORE_AVERAGE

        const avgWakeupTime = Math.round(
          last7TrackingResult.reduce(
            (prev, next) => prev + parseInt(next.wokeUpTime),
            0
          ) / MINIMUM_RECORD_TO_CHECK_AVERAGE
        )
        const diffWakeUptime = Math.abs(
          this.diffTimeInMinutes(wakeUpTime, moment.unix(avgWakeupTime))
        )
        avgWakeUpTimeScore =
          AVERAGE_WAKEUP_TIME_RANGE_SCORE.find(
            (e) => e.minutesRange >= diffWakeUptime
          )?.score || AVERAGE_WAKEUP_TIME_DEFAULT_SCORE
      }
    }
    const getWakeUpTimeScore = () => {
      const diffFromWakeUpToAlarmTime = wakeUpTime.diff(tAlarmRing, 'minutes')
      if (diffFromWakeUpToAlarmTime > 0) {
        wakeUpTimeScore =
          AFTER_ALARM_SCORE_SETUP.find(
            (e) => diffFromWakeUpToAlarmTime <= e.minutesRange
          )?.score || OUTRANGE_WAKEUP_AFTER_ALARM_SCORE
      } else {
        wakeUpTimeScore =
          WAKEUP_BEFORE_ALARM_SCORE_SETUP.find(
            (e) => Math.abs(diffFromWakeUpToAlarmTime) <= e.minutesRange
          )?.score || OUTRANGE_WAKEUP_BEFORE_ALARM_SCORE
      }
    }
    const getSleepDurationScore = () => {
      const sleepDuration = wakeUpTime.diff(startTime, 'hours', true)
      const bedTypeTime = SLEEP_DURATION_SCORE[tracking.bedType.toUpperCase()]
      sleepDurationScore =
        bedTypeTime.find(
          (e) => sleepDuration >= e.min && sleepDuration <= e.max
        )?.score || OUTRANGE_SLEEP_DURATION_SCORE
    }

    getAverageScoreByLastResult()
    getWakeUpTimeScore()
    getSleepDurationScore()

    return (
      avgStartTimeScore +
      avgWakeUpTimeScore +
      wakeUpTimeScore +
      sleepDurationScore
    )
  }

  diffTimeInMinutes(dateA: Moment, dateB: Moment): number {
    const nowA = moment()
      .set('hours', dateA.hours())
      .set('minutes', dateA.minutes())
    const nowB = moment()
      .set('hours', dateB.hours())
      .set('minutes', dateB.minutes())
    return nowA.diff(nowB, 'minutes')
  }
}
