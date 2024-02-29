import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import { HeathAppDataDetail } from '../../health-app-data/dto/create-data-health-app.dto'

export class WakeUpResultDto {
  @Type(() => HeathAppDataDetail)
  @ApiProperty({
    required: true,
    isArray: true,
    example: [
      {
        dataType: 'SLEEP_ASLEEP',
        value: '480.0',
        platformType: 'ANDROID',
        unit: 'MINUTE',
        dateFrom: '2022-07-11T13:59:00.000',
        dateTo: '2022-07-11T21:59:00.000',
        sourceName: 'com.google.android.apps.fitness',
        sourceId: '089ccfba-fe73-4ac2-a803-602b08febef9'
      }
    ]
  })
  @ValidateNested({ each: true })
  @IsArray()
  datas: Array<HeathAppDataDetail>
}
