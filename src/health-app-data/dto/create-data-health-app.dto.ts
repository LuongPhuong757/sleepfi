import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator'
export class HealthAppDataDto {
  @ApiProperty({ required: true })
  @IsNumber()
  trackingId: number
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

export class HeathAppDataDetail {
  @ApiProperty({ required: true })
  @IsString()
  dataType: string

  @ApiProperty({ required: true })
  @IsString()
  value: string

  @ApiProperty({ required: true })
  @IsString()
  platformType: string

  @ApiProperty({ required: true })
  @IsString()
  unit: string

  @ApiProperty({ required: true })
  @IsString()
  dateFrom: Date

  @ApiProperty({ required: true })
  @IsString()
  dateTo: Date

  @ApiProperty({ required: true })
  @IsString()
  sourceName: string

  @ApiProperty({ required: true })
  @IsString()
  sourceId: string
}
