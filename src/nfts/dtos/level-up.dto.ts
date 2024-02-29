import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class LevelUpInput {
  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  next_level: number

  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  sleep_time: number
}
