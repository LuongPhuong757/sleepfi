import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class TrackingResultDto {
  @IsString()
  @ApiProperty({
    example: '2022-07-27',
    description: 'format YYYY-MM-DD'
  })
  fdate: string

  @ApiProperty({
    example: '2022-07-27',
    description: 'format YYYY-MM-DD'
  })
  @IsString()
  tdate: string

  @ApiProperty({
    example: 'day',
    description: 'day | week |month'
  })
  @IsString()
  type: string
}
