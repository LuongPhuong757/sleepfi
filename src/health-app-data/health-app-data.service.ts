import { Injectable } from '@nestjs/common'
import moment from 'moment'
import { HealthAppData } from 'src/databases/entities/health-app-data.entity'

import { HealthAppDataDto } from './dto/create-data-health-app.dto'
import { HealthAppDataRepository } from './health-app-data.repository'
@Injectable()
export class HealthAppDataSevice {
  constructor(
    private readonly healthAppDataRepository: HealthAppDataRepository
  ) {}

  async insertDataFromHealthApp(
    userCtx: any,
    healthAppDataDto: HealthAppDataDto
  ) {
    try {
      const trackingId = healthAppDataDto.trackingId
      for await (const item of healthAppDataDto.datas) {
        const healthAppData = new HealthAppData()
        healthAppData.owner = userCtx.wallet
        healthAppData.trackingId = trackingId
        healthAppData.dataType = item.dataType
        healthAppData.value = item.value
        healthAppData.platformType = item.platformType
        healthAppData.unit = item.unit
        healthAppData.dateFrom = item.dateFrom
        healthAppData.dateTo = item.dateTo
        healthAppData.sourceName = item.sourceName
        healthAppData.sourceId = item.sourceId
        healthAppData.year = moment(item.dateFrom).year()
        healthAppData.month = moment(item.dateFrom).month() + 1
        healthAppData.day = moment(item.dateFrom).date()
        await healthAppData.save()
      }
      return {
        status: 'success',
        trackingId: trackingId
      }
    } catch (error) {
      throw error
    }
  }

  formatDataHealApp(
    healthAppDataDto: HealthAppDataDto,
    wallet: string
  ): HealthAppData[] {
    try {
      const trackingId = healthAppDataDto.trackingId
      const healAppData = []
      for (const item of healthAppDataDto.datas) {
        const healthAppData = new HealthAppData()
        healthAppData.owner = wallet
        healthAppData.trackingId = trackingId
        healthAppData.dataType = item.dataType
        healthAppData.value = item.value
        healthAppData.platformType = item.platformType
        healthAppData.unit = item.unit
        healthAppData.dateFrom = item.dateFrom
        healthAppData.dateTo = item.dateTo
        healthAppData.sourceName = item.sourceName
        healthAppData.sourceId = item.sourceId
        healthAppData.year = moment(item.dateFrom).year()
        healthAppData.month = moment(item.dateFrom).month()
        healthAppData.day = moment(item.dateFrom).date()
        healAppData.push(healthAppData)
      }
      return healAppData
    } catch (error) {
      throw error
    }
  }
}
